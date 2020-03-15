import json

from .http import HttpDataProvider


class OvApiError(Exception):
    """OvAPI related exception."""


class OvApiDataProvider(HttpDataProvider):
    """Data provider that returns information for a specific bus stop."""

    def __init__(self, stop_code: str=None):
        """Constructor. Initialises the instance.
        :param stop_code bus stop code.
        """
        if stop_code is None:
            raise OvApiError('OvApiDataProvider(): parameter "stop_code" is mandatory')
        self.stop_code = stop_code

    def get_url(self):
        return 'http://v0.ovapi.nl/stopareacode/' + self.stop_code

    def process_data(self, data: str):
        # Parse and return the JSON data
        stops = json.loads(data)[self.stop_code]

        # Calculate delays in minutes
        for stop in stops.values():
            for pss in stop['Passes'].values():
                pss['delay'] = self.calc_delay(pss['TargetDepartureTime'], pss['ExpectedDepartureTime'])
        return stops
