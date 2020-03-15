from abc import ABCMeta
import json

from .http import HttpDataProvider
from ..ns_api_key import NSAPIKey

STATUS_MAP = {
    'VOLGENS-PLAN':  'ok',            # On schedule
    'NIET-OPTIMAAL': 'subopt',        # Suboptimal
    'NIET-MOGELIJK': 'impossible',    # Impossible
    'GEANNULEERD':   'canceled',      # Canceled
    'VERTRAAGD':     'delayed',       # Delayed
    'PLAN-GEWIJZGD': 'plan-changed',  # Plan changed
    'GEWIJZIGD':     'changed',       # Changed
    'NIEUW':         'new',           # New
}


class NSError(Exception):
    """NS API related exception."""


class NSDataProvider(HttpDataProvider, metaclass=ABCMeta):
    """Abstract base data provider class for NS-based services. Provides default request authentication."""

    def get_query_headers(self):
        # Add an API key header
        return {'Ocp-Apim-Subscription-Key': NSAPIKey.get_subscription_key()}


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
        return 'https://gateway.apiportal.ns.nl/reisinformatie-api/api/v2/departures'

    def get_query_params(self) -> dict:
        return {'station': self.station, 'lang': 'en'}

    def process_data(self, data: str):
        # Parse and return the JSON data
        departures = json.loads(data)['payload']['departures']

        # Calculate delays in minutes
        for dep in departures:
            dep['delay'] = self.calc_delay(dep['plannedDateTime'], dep['actualDateTime'])
        return departures


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
        return 'https://gateway.apiportal.ns.nl/public-reisinformatie/api/v3/trips'

    def get_query_params(self) -> dict:
        return {
            'fromStation':     self.from_st,
            'toStation':       self.to_st,
            'viaStation':      self.via_st,
            'previousAdvices': self.num_prev,
            'nextAdvices':     self.num_next,
            'dateTime':        self.time,
            'departure':       self.is_departure,
            'hslAllowed':      self.hsl,
            'yearCard':        self.ann_card,
        }

    def process_data(self, data: str):
        # Parse and return the JSON data
        return json.loads(data)
