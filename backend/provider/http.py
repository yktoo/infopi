import logging
from abc import ABCMeta, abstractmethod
from urllib import request, parse

from .data_provider import DataProvider


class HttpDataProvider(DataProvider, metaclass=ABCMeta):
    """Abstract data provider that can fetch data from an HTTP server."""

    def get(self):
        try:
            # Construct a HTTP request
            url = self.get_url() + '?' + parse.urlencode(self.get_query_params())
            req = request.Request(url)

            # Add headers, if any
            for hdr_name, hdr_value in self.get_query_headers().items():
                req.add_header(hdr_name, hdr_value)

            # Fetch data from the server
            data = request.urlopen(req).read().decode('utf-8')

            # Process and return the data
            return self.process_data(data)
        except Exception as e:
            logging.exception(e)
            return None

    @abstractmethod
    def get_url(self):
        """Return URL to fetch data from."""

    # noinspection PyMethodMayBeStatic
    def get_query_params(self) -> dict:
        """Return parameters for the URL query string, as a dictionary. Base class returns an empty dictionary."""
        return {}

    # noinspection PyMethodMayBeStatic
    def get_query_headers(self) -> dict:
        """Return additional headers for the URL query, as a dictionary. Base class returns an empty dictionary."""
        return {}

    @abstractmethod
    def process_data(self, data: str):
        """Process data received from the server and return it.
        :param data raw HTML data to format.
        :returns ready for use data as an object.
        """
