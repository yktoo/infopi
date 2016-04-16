import re
from xml.etree import ElementTree

from .http import HttpDataProvider


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
            'current': {
                'updated':        e_station.findtext('datum'),
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
                'text':           e_icon.get('zin'),                       # In Dutch, eg. 'bewolkt'
            }
        }
