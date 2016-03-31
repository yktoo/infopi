from abc import ABCMeta, abstractmethod
from xml.etree import ElementTree
import urllib.request
import dateutil.parser

from ns_api_key import NSAPIKey


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
        html = urllib.request.urlopen(self.get_url()).read().decode('utf-8')

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

    def process_data(self, data: str) -> str:
        e_root = ElementTree.fromstring(data)

        # Sanity check
        if e_root.tag != 'ActueleVertrekTijden':
            raise LookupError('Root XML node is not ActueleVertrekTijden')

        output_data = []

        # Iterate through train data
        for e_train in e_root:
            # Sanity check
            if e_train.tag != 'VertrekkendeTrein':
                raise LookupError('Train XML node is not VertrekkendeTrein')

            # Parse the departure time
            dep_time = dateutil.parser.parse(e_train.findtext('VertrekTijd', ''))

            # Append a data row
            output_data.append({
                'time':  dep_time.strftime('%H:%M'),
                'delay': e_train.findtext('VertrekVertragingTekst',  ''),
                'dest':  e_train.findtext('EindBestemming',          ''),
                'type':  e_train.findtext('TreinSoort',              ''),
                'platf': e_train.findtext('VertrekSpoor',            '')
            })

        # Format data as HTML table
        tbl_body = ''
        for row in output_data:
            tbl_body += \
                '<tr>' \
                '<td class="train-time" >{time}</td>' \
                '<td class="train-delay">{delay}</td>' \
                '<td class="train-dest" >{dest}</td>' \
                '<td class="train-type" >{type}</td>' \
                '<td class="train-platf">{platf}</td>' \
                '</tr>'.format(**row)

        return '<table class="table">' + tbl_body + '</table>'
