import re
from abc import ABCMeta, abstractmethod
from urllib.request import urlopen


class DataProvider(metaclass=ABCMeta):
    """Abstract data provider that can fetch and return some data to be displayed."""

    @abstractmethod
    def fetch(self):
        """Return data provided by the instance of the class as HTML. Should return None if data fetching failed for any
        reason.
        """


class HttpDataProvider(DataProvider, metaclass=ABCMeta):
    """Abstract data provider that can fetch data from an HTTP server."""

    def fetch(self):
        # Fetch data from the server
        html = urlopen(self.get_url()).read().decode('utf-8')

        # Process and return the data
        return self.process_data(html)

    @abstractmethod
    def get_url(self):
        """Return URL to fetch data from."""

    @abstractmethod
    def process_data(self, data: str) -> str:
        """Process data received from the server and return it as HTML.
        :param data raw HTML data to format.
        :returns ready for use HTML data
        """


class NSDepartureTimesProvider(HttpDataProvider):
    """Data provider that returns train departure times scraped from NS website."""

    def __init__(self, station_code: str):
        """Constructor. Initialises the instance.
        :type station_code code of the station
        """
        self.station_code = station_code

    def get_url(self):
        return 'http://www.ns.nl/actuele-vertrektijden/avt?station=' + self.station_code

    def process_data(self, data: str) -> str:
        # Extract the timetable from the data
        match = re.search(r'<table class="avt_table">(.+?)</table>', data, flags=re.DOTALL)
        if match:
            return '<table class="table">{}</table>'.format(match.group(1))
        else:
            return None

