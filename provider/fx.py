from xml.etree import ElementTree

from .http import HttpDataProvider


_NS_GESMES    = '{http://www.gesmes.org/xml/2002-08-01}'
_NS_ECB       = '{http://www.ecb.int/vocabulary/2002-08-01/eurofxref}'
_TAG_ENVELOPE = _NS_GESMES + 'Envelope'
_TAG_CUBE     = _NS_ECB + 'Cube'


class FxError(Exception):
    """Fx API related exception."""


class FxDataProvider(HttpDataProvider):
    """Data provider that returns currency exchange rates."""

    def __init__(self, base_currency: str=None, date: str=None):
        """Constructor. Initialises the instance.
        :param base_currency base currency name.
        :param date date get quotes for in the format 'yyyy-mm-dd'. If None, the latest quotes are fetched.
        """
        if base_currency is None:
            raise FxError('FxDataProvider(): parameter "base_currency" is mandatory')
        self.base_currency = base_currency
        self.date          = date

    def get_url(self):
        return 'https://www.ecb.europa.eu/stats/eurofxref/eurofxref-hist-90d.xml'

    def process_data(self, data: str):
        # Parse the XML
        e_root = ElementTree.fromstring(data)

        # Error/sanity check
        if e_root.tag != _TAG_ENVELOPE:
            raise FxError('Root XML node is "{}", not <Envelope>'.format(e_root.tag))
        e_dates = e_root.find(_TAG_CUBE)
        if not e_dates:
            raise FxError('Cannot find the <Cube> element')

        # Find the requested date node
        e_selected_date = None
        for e_date in e_dates:
            if self.date is None or e_date.attrib['time'] == self.date:
                e_selected_date = e_date
                break

        # Validate the date
        if not e_selected_date:
            raise FxError('Could not find the requested date "{}"'.format(self.date or 'latest'))

        # Create a map of currency values
        rates = {e_rate.attrib['currency']: float(e_rate.attrib['rate']) for e_rate in e_selected_date}

        # EUR is the reference currency so we need to add it manually
        rates['EUR'] = 1.0

        # Fix the requested base rate [to EUR]
        if self.base_currency not in rates:
            raise FxError('Could not find a rate for the requested base currency "{}"'.format(self.base_currency))
        base_rate = rates[self.base_currency]

        # Populate the remaining rates by recalibrating them to the base currency
        return {
            'date':  e_selected_date.attrib['time'],
            'rates': {ccy: base_rate / rate for ccy, rate in rates.items()}
        }
