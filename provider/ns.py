from xml.etree import ElementTree
import urllib.request
import dateutil.parser

from .http import HttpDataProvider

from ns_api_key import NSAPIKey


class NSDepartureTimesProvider(HttpDataProvider):
    """Data provider that returns train departure times scraped from NS website."""

    def __init__(self, station_code: str):
        """Constructor. Initialises the instance.
        :type station_code code of the station
        """
        self.station_code = station_code

        # Create a password manager
        password_mgr = urllib.request.HTTPPasswordMgrWithDefaultRealm()
        password_mgr.add_password(None, 'http://webservices.ns.nl/', NSAPIKey.get_username(), NSAPIKey.get_password())

        # Create an authentication handler
        handler = urllib.request.HTTPBasicAuthHandler(password_mgr)

        # Create and install an "opener" (OpenerDirector instance)
        opener = urllib.request.build_opener(handler)
        urllib.request.install_opener(opener)

    def get_url(self):
        return 'http://webservices.ns.nl/ns-api-avt?station=' + self.station_code

    def process_data(self, data: str):
        # Parse the XML
        e_root = ElementTree.fromstring(data)

        # Sanity check
        if e_root.tag != 'ActueleVertrekTijden':
            raise LookupError('Root XML node is not <ActueleVertrekTijden>')

        output_data = []

        # Iterate through train data
        for e_train in e_root:
            # Sanity check
            if e_train.tag != 'VertrekkendeTrein':
                raise LookupError('Train XML node is not VertrekkendeTrein')

            # Parse the departure time
            dep_time = dateutil.parser.parse(e_train.findtext('VertrekTijd', ''))

            # Collect notes
            e_notes = e_train.find('Opmerkingen')
            notes = None
            if e_notes is not None:
                notes = ' '.join([t.strip() for t in e_notes.itertext()])

            # Append a data row
            output_data.append({
                'time':  dep_time.strftime('%H:%M'),
                'delay': e_train.findtext('VertrekVertragingTekst',  ''),
                'dest':  e_train.findtext('EindBestemming',          ''),
                'type':  e_train.findtext('TreinSoort',              ''),
                'platf': e_train.findtext('VertrekSpoor',            ''),
                'notes': notes
            })

        return output_data
