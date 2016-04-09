from abc import ABCMeta, abstractmethod
import urllib.request

from .data_provider import DataProvider


class HttpDataProvider(DataProvider, metaclass=ABCMeta):
    """Abstract data provider that can fetch data from an HTTP server."""

    def get(self):
        # Fetch data from the server
        data = urllib.request.urlopen(self.get_url()).read().decode('utf-8')

        # Process and return the data
        return self.process_data(data)

    @abstractmethod
    def get_url(self):
        """Return URL to fetch data from."""

    @abstractmethod
    def process_data(self, data: str):
        """Process data received from the server and return it.
        :param data raw HTML data to format.
        :returns ready for use data as an object.
        """
