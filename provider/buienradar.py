import re
from xml.etree import ElementTree

from .http import HttpDataProvider

ICON_TO_WI_CLASS_MAP = {
    'a.gif': 'wi-day-sunny',
    'b.gif': 'wi-day-cloudy',
    'c.gif': 'wi-cloud',
    'd.gif': 'wi-day-fog',
    'e.gif': 'wi-fog',
    'f.gif': 'wi-day-sprinkle',
    'g.gif': 'wi-day-thunderstorm',
    'h.gif': 'wi-day-rain',
    'i.gif': 'wi-day-rain',
    'k.gif': 'wi-day-showers',
    'l.gif': 'wi-rain',
    'm.gif': 'wi-sleet',
    'n.gif': 'wi-snowflake-cold',
    'o.gif': 'wi-day-cloudy',
    'p.gif': 'wi-cloud',
    'q.gif': 'wi-rain',
    's.gif': 'wi-storm-showers',
    't.gif': 'wi-snow',
    'u.gif': 'wi-day-snow',
    'v.gif': 'wi-sleet',
    'w.gif': 'wi-wi-rain-mix',
    'x.gif': 'wi-snow',
    'y.gif': 'wi-snow-wind',
    'z.gif': 'wi-snow-wind',
}


class BuienRadarDataProvider(HttpDataProvider):
    """Weather data provider taking its data from weer.nl"""

    def __init__(self, station_id: str):
        """Constructor. Initialises the instance.
        :type station_id ID of BuienRadar station to get weather data for
        """
        self.station_id = station_id

    @staticmethod
    def get_element(parent, path: str):
        """Finds and returns the first element by given XPath, or raises an exception if not found.
        :param parent: Parent element
        :param path: Tag name or path expression
        """
        el = parent.find(path)
        if el is None:
            raise LookupError('Element {} doesn\'t have a child matching path "{}"'.format(parent.tag, path))
        return el

    def get_url(self):
        return 'http://xml.buienradar.nl/'

    def process_data(self, data: str):
        # Parse the XML
        e_root = ElementTree.fromstring(data)

        # Sanity check
        if e_root.tag != 'buienradarnl':
            raise LookupError('Root XML node is not <buienradarnl>')

        # Find the required nodes
        e_station = self.get_element(
            e_root,
            "./weergegevens/actueel_weer/weerstations/weerstation[@id='{}']".format(self.station_id))
        e_icon = self.get_element(e_station, 'icoonactueel')

        return {
            'updated':            e_station.findtext('datum'),
            'current': {
                'station': {
                    'code':       e_station.findtext('stationcode'),
                    'name':       e_station.findtext('stationnaam'),
                    'latitude':   e_station.findtext('lat'),
                    'longitude':  e_station.findtext('lon'),
                },
                'temperature':    e_station.findtext('temperatuurGC'),     # In °C
                'humidity':       e_station.findtext('luchtvochtigheid'),
                'pressure':       e_station.findtext('luchtdruk'),         # In hPa
                'wind': {
                    'dirText':    e_station.findtext('windrichting'),      # Text, like 'WZW'
                    'dirDegrees': e_station.findtext('windrichtingGR'),    # In degrees
                    'speed':      e_station.findtext('windsnelheidBF'),    # In bft
                    'gusts':      e_station.findtext('windstotenMS')       # In m/s
                },
                'rain':           e_station.findtext('regenMMPU'),         # In mm/h
                'visibility':     e_station.findtext('zichtmeters'),       # In metres
                'iconUrl':        e_icon.text,                             # Full URL, ie. http://...
                'iconWiClass':    self.get_wi_icon_class(e_icon.text),     # One of the wi-* classes
                'text':           e_icon.get('zin'),                       # In Dutch, eg. 'bewolkt'
            }
        }

    @staticmethod
    def get_wi_icon_class(url):
        """Return name of the weather-icon class for the given BuienRadar icon URL."""
        match = re.search(r'xml.buienradar.nl/icons/([a-z.]+)$', url)
        if match is not None:
            icon = match.group(1)
            return ICON_TO_WI_CLASS_MAP[icon] if icon in ICON_TO_WI_CLASS_MAP else 'wi-alien'
