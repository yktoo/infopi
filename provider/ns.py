from abc import ABCMeta
from xml.etree import ElementTree
import urllib.request
import dateutil.parser

from .http import HttpDataProvider

from ns_api_key import NSAPIKey

STATUS_MAP = {
    'VOLGENS-PLAN':  'ok',          # On schedule
    'NIET-OPTIMAAL': 'subopt',      # Suboptimal
    'NIET-MOGELIJK': 'impossible',  # Impossible
    'GEANNULEERD':   'canceled',    # Canceled
    'VERTRAAGD':     'delayed',     # Delayed
    'PLAN-GEWIJZGD': 'changed',     # Changed
    'NIEUW':         'new',         # New
}


class NSError(Exception):
    """NS API related exception."""


class NSDataProvider(HttpDataProvider, metaclass=ABCMeta):
    """Abstract base data provider class for NS-based services. Provides default request authentication."""

    def __init__(self):
        # Create a password manager
        password_mgr = urllib.request.HTTPPasswordMgrWithDefaultRealm()
        password_mgr.add_password(None, 'http://webservices.ns.nl/', NSAPIKey.get_username(), NSAPIKey.get_password())

        # Create an authentication handler
        handler = urllib.request.HTTPBasicAuthHandler(password_mgr)

        # Create and install an "opener" (OpenerDirector instance)
        opener = urllib.request.build_opener(handler)
        urllib.request.install_opener(opener)


class NSDepartureTimesProvider(NSDataProvider):
    """Data provider that returns train departure times provided by NS."""

    def __init__(self, station: str=None):
        """Constructor. Initialises the instance.
        :param station code of the station
        """
        super().__init__()
        if station is None:
            raise NSError('NSDepartureTimesProvider(): parameter "station" is mandatory')
        self.station = station

    def get_url(self):
        return 'http://webservices.ns.nl/ns-api-avt'

    def get_query_params(self) -> dict:
        return {'station': self.station}

    def process_data(self, data: str):
        # Parse the XML
        e_root = ElementTree.fromstring(data)

        # Error/sanity check
        if e_root.tag == 'error':
            raise NSError('API error: ' + e_root.findtext('message', '(unknown error)'))
        if e_root.tag != 'ActueleVertrekTijden':
            raise NSError('Root XML node is not <ActueleVertrekTijden>')

        output_data = []

        # Iterate through train data
        for e_train in e_root:
            # Sanity check
            if e_train.tag != 'VertrekkendeTrein':
                raise NSError('Train XML node is not <VertrekkendeTrein>')

            # Collect notes
            e_notes = e_train.find('Opmerkingen')
            notes = None
            if e_notes is not None:
                notes = ' '.join([t.strip() for t in e_notes.itertext()])

            # Append a data row
            output_data.append({
                'time':  e_train.findtext('VertrekTijd'),
                'delay': e_train.findtext('VertrekVertragingTekst'),
                'dest':  e_train.findtext('EindBestemming'),
                'type':  e_train.findtext('TreinSoort'),
                'platf': e_train.findtext('VertrekSpoor'),
                'notes': notes
            })

        return output_data


class NSTravelAdviceProvider(NSDataProvider):
    """Data provider that returns travel advice provided by NS."""

    def __init__(self, from_st: str = None, to_st: str = None, time: str = '', via_st: str = '', num_prev: int = 5,
                 num_next: int = 5, is_departure: bool = True, hsl: bool = True, ann_card: bool = False):
        """Constructor. Initialises the instance.
        :param from_st      Code/name of the departure station.
        :param to_st        Code/name of the arrival station.
        :param time         ISO8601 formatted date/time, e.g. '2012-02-21T15:50'.
        :param via_st       Code/name of the en route station.
        :param num_prev     Required number of past advices. Default and maximum is 5.
        :param num_next     Required number of future advices. Default and maximum is 5.
        :param is_departure Boolean, true - dateTime is departure time, false - it's arrival time.
        :param hsl          Boolean, whether to include high-speed trains.
        :param ann_card     Boolean, whether the user has an annual travel card.
        """
        super().__init__()
        self.from_st      = from_st
        self.to_st        = to_st
        self.time         = time
        self.via_st       = via_st
        self.num_prev     = num_prev
        self.num_next     = num_next
        self.is_departure = is_departure
        self.hsl          = hsl
        self.ann_card     = ann_card
        if from_st is None:
            raise NSError('Parameter "from_st" is mandatory')
        if to_st is None:
            raise NSError('Parameter "to_st" is mandatory')

    def get_url(self):
        return 'http://webservices.ns.nl/ns-api-treinplanner'

    def get_query_params(self) -> dict:
        return {
            'fromStation':     self.from_st,
            'toStation':       self.to_st,
            'viaStation':      self.via_st,
            'previousAdvices': self.num_prev,
            'nextAdvices':     self.num_next,
            'dateTime':        self.time,
            'Departure':       self.is_departure,
            'hslAllowed':      self.hsl,
            'yearCard':        self.ann_card,
        }

    def process_data(self, data: str):
        # Parse the XML
        e_root = ElementTree.fromstring(data)

        # Error/sanity check
        if e_root.tag == 'error':
            raise NSError('API error: ' + e_root.findtext('message', '(unknown error)'))
        if e_root.tag != 'ReisMogelijkheden':
            raise NSError('Root XML node is not <ReisMogelijkheden>')

        output_data = []

        # Iterate through the advices
        for e_advice in e_root:
            # Sanity check
            if e_advice.tag != 'ReisMogelijkheid':
                raise NSError('Travel advice XML node is not <ReisMogelijkheid>')

            # Append a data row
            output_data.append({
                'numChanges':      e_advice.findtext('AantalOverstappen'),
                'plannedDuration': e_advice.findtext('GeplandeReisTijd'),
                'actualDuration':  e_advice.findtext('ActueleReisTijd'),
                'isOptimal':       e_advice.findtext('Optimaal'),
                'plannedDepTime':  e_advice.findtext('GeplandeVertrekTijd'),
                'actualDepTime':   e_advice.findtext('ActueleVertrekTijd'),
                'plannedArrTime':  e_advice.findtext('GeplandeAankomstTijd'),
                'actualArrTime':   e_advice.findtext('ActueleAankomstTijd'),
                'status':          self.recode_status(e_advice.findtext('Status')),
                'fragments':       [self.parse_fragment(e_fragment) for e_fragment in e_advice.findall('./ReisDeel')],
                'notifications':   [self.parse_notification(e_notf) for e_notf in e_advice.findall('./Melding')],
            })

        return output_data

    # noinspection PyMethodMayBeStatic
    def recode_status(self, status):
        """Recodes the status ID from Dutch to English."""
        return STATUS_MAP[status] if status in STATUS_MAP else status

    def parse_fragment(self, e_fragment):
        """Parse a fragment of the travel advice and return a dictionary with parsed data.
        :param e_fragment: The <ReisDeel> XML element
        """
        return {
            'kind':        e_fragment.get('reisSoort'),
            'company':     e_fragment.findtext('Vervoerder'),
            'type':        e_fragment.findtext('VervoerType'),
            'journeyCode': e_fragment.findtext('RitNummer'),
            'status':      self.recode_status(e_fragment.findtext('Status')),
            'stops':       [self.parse_stop(e_stop) for e_stop in e_fragment.findall('./ReisStop')]
        }

    # noinspection PyMethodMayBeStatic
    def parse_stop(self, e_stop):
        """Parse a stop of the travel advice fragment and return a dictionary with parsed data.
        :param e_stop: The <ReisStop> XML element
        """
        return {
            'name':     e_stop.findtext('Naam'),
            'time':     e_stop.findtext('Tijd'),
            'platform': e_stop.findtext('Spoor'),
        }

    # noinspection PyMethodMayBeStatic
    def parse_notification(self, e_notification):
        """Parse a notification of the travel advice and return a dictionary with parsed data.
        :param e_notification: The <Melding> XML element
        """
        return {
            'id':     e_notification.findtext('Id'),
            'severe': e_notification.findtext('Ernstig'),
            'text':   e_notification.findtext('Text'),
        }
