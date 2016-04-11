import datetime
import logging
from http.server import HTTPServer

from provider.ns import NSDepartureTimesProvider
from provider.weather import WeatherDataProvider
from req_handler import HomePiRequestHandler

HTML_TEMPLATE_FILE = 'template.html'


class HomePiServer:
    """The main component of the system."""

    def __init__(self):
        """Constructor"""
        # Create data providers
        self.provider_trains_houtenc = NSDepartureTimesProvider('htnc')
        self.provider_trains_utrecht = NSDepartureTimesProvider('ut')
        self.provider_weather = WeatherDataProvider('NLXX0018')

        # Instantiate a request handler
        req_handler = HomePiRequestHandler
        req_handler.pi_server = self

        # Instantiate a HTTP server
        self.http_server = HTTPServer(('', 8000), req_handler)

    def get_html(self):
        """Returns HTML page containing all information."""
        # Fetch the data
        args = {
            'now':       datetime.datetime.now(),
            'trains_ht': self.format_train_table(self.provider_trains_houtenc.get()),
            'trains_ut': self.format_train_table(self.provider_trains_utrecht.get()),
            'weather':   self.provider_weather.get(),
        }

        # Load the template
        template = self.get_template()

        # Enrich the template with the data
        return template.format(**args)

    @staticmethod
    def format_train_table(data: list) -> str:
        """Formats train time table data as an HTML table and returns it.
        :param data: train time table data.
        """
        if data is None:
            return 'N/A'

        tbl_body = ''
        for row in data:
            tbl_body += \
                '<tr>' \
                '<td class="train-time" >{time}</td>' \
                '<td class="train-delay">{delay}</td>' \
                '<td class="train-dest" >{dest}</td>' \
                '<td class="train-type" >{type}</td>' \
                '<td class="train-platf">{platf}</td>' \
                '</tr>'.format(**row)

        return '<table class="table">' + tbl_body + '</table>'

    @staticmethod
    def get_template() -> str:
        """Return the HTML template text."""
        with open(HTML_TEMPLATE_FILE, 'r') as f:
            return f.read()

    def run(self):
        """Run the server indefinitely."""
        logging.info('Running server...')
        self.http_server.serve_forever()
