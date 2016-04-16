import re
from xml.etree import ElementTree

from .http import HttpDataProvider

ICON_TO_WI_CLASS_MAP = {
    'a': 'wi-day-sunny',
    'b': 'wi-day-cloudy',
    'c': 'wi-cloud',
    'd': 'wi-day-fog',
    'e': 'wi-fog',
    'f': 'wi-day-sprinkle',
    'g': 'wi-day-thunderstorm',
    'h': 'wi-day-rain',
    'i': 'wi-day-rain',
    'k': 'wi-day-showers',
    'l': 'wi-rain',
    'm': 'wi-sleet',
    'n': 'wi-snowflake-cold',
    'o': 'wi-day-cloudy',
    'p': 'wi-cloud',
    'q': 'wi-rain',
    's': 'wi-storm-showers',
    't': 'wi-snow',
    'u': 'wi-day-snow',
    'v': 'wi-sleet',
    'w': 'wi-wi-rain-mix',
    'x': 'wi-snow',
    'y': 'wi-snow-wind',
    'z': 'wi-snow-wind',
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

        e_station = self.get_element(
            e_root,
            "./weergegevens/actueel_weer/weerstations/weerstation[@id='{}']".format(self.station_id))

        # Process the current weather
        e_icon = self.get_element(e_station, 'icoonactueel')
        current = {
            'station': {
                'code':       e_station.findtext('stationcode'),
                'name':       e_station.findtext('stationnaam'),
                'latitude':   e_station.findtext('lat'),
                'longitude':  e_station.findtext('lon'),
            },
            'temperature':    e_station.findtext('temperatuurGC'),      # In °C
            'humidity':       e_station.findtext('luchtvochtigheid'),
            'pressure':       e_station.findtext('luchtdruk'),          # In hPa
            'wind': {
                'dirText':    e_station.findtext('windrichting'),       # Text, like 'WZW'
                'dirDegrees': e_station.findtext('windrichtingGR'),     # In degrees
                'speed':      e_station.findtext('windsnelheidBF'),     # In bft
                'gusts':      e_station.findtext('windstotenMS')        # In m/s
            },
            'rain':           e_station.findtext('regenMMPU'),          # In mm/h
            'visibility':     e_station.findtext('zichtmeters'),        # In metres
            'iconUrl':        e_icon.text,                              # Full URL, ie. http://...
            'iconWiClass':    self.get_wi_icon_class(e_icon.get('ID')), # One of the wi-* classes
            'text':           e_icon.get('zin'),                        # In Dutch, eg. 'bewolkt'
        }

        # Process the forecast
        forecast = []
        for e_day in e_root.findall('./weergegevens/verwachting_meerdaags/*[datum]'):
            e_day_icon = self.get_element(e_day, 'icoon')
            forecast.append({
                'date':            e_day.findtext('datum'),                     # Full date, eg. 'zondag 17 april 2016'
                'dow':             e_day.findtext('dagweek'),                   # Two-letter weekday name in Dutch
                'probSun':         e_day.findtext('kanszon'),                   # Probability in percent
                'probSnow':        e_day.findtext('sneeuwcms'),                 # Probability in percent
                'rain': {
                    'probability': e_day.findtext('kansregen'),                 # Probability in percent
                    'minAmount':   e_day.findtext('minmmregen'),                # Minimum amount in mm
                    'maxAmount':   e_day.findtext('maxmmregen'),                # Maximum amount in mm
                },
                'temperature': {
                    'lowMin':      e_day.findtext('mintemp'),                   # In °C
                    'lowMax':      e_day.findtext('mintempmax'),                # In °C
                    'highMin':     e_day.findtext('maxtemp'),                   # In °C
                    'highMax':     e_day.findtext('maxtempmax'),                # In °C
                },
                'wind': {
                    'dirText':     e_day.findtext('windrichting'),              # Text, like 'WZW'
                    'speed':       e_day.findtext('windkracht'),                # In bft
                },
                'iconUrl':         e_day_icon.text,                              # Full URL, ie. http://...
                'iconWiClass':     self.get_wi_icon_class(e_day_icon.get('ID')), # One of the wi-* classes
            })

        return {
            'updated':  e_station.findtext('datum'),
            'current':  current,
            'forecast': forecast
        }

    @staticmethod
    def get_wi_icon_class(icon_id: str):
        """Return name of the weather-icon class for the given BuienRadar icon URL.
        :param icon_id: one-letter icon ID
        """
        if icon_id in ICON_TO_WI_CLASS_MAP:
            return ICON_TO_WI_CLASS_MAP[icon_id]
        else:
            return 'wi-alien'
