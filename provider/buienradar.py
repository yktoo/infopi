from xml.etree import ElementTree

from .http import HttpDataProvider

ICON_TO_WI_CLASS_MAP = {
    # Day
    'a':  'wi-day-sunny',
    'b':  'wi-day-cloudy',
    'c':  'wi-cloud',
    'd':  'wi-day-cloudy-windy',
    'e':  'wi-day-fog',
    'f':  'wi-day-sprinkle',
    'g':  'wi-day-thunderstorm',
    'h':  'wi-day-rain',
    'i':  'wi-day-rain',
    'k':  'wi-day-showers',
    'l':  'wi-day-sleet',
    'm':  'wi-sleet',
    'n':  'wi-snowflake-cold',
    'o':  'wi-day-cloudy',
    'p':  'wi-cloud',
    'q':  'wi-sleet',
    's':  'wi-day-sleet-storm',
    't':  'wi-snow',
    'u':  'wi-day-snow',
    'v':  'wi-sleet',
    'w':  'wi-rain-mix',
    'x':  'wi-snow',
    'y':  'wi-snow-wind',
    'z':  'wi-snow-wind',
    # Night
    'aa': 'wi-night-clear',
    'bb': 'wi-night-partly-cloudy',
    'cc': 'wi-night-alt-cloudy',
    'dd': 'wi-night-alt-cloudy-windy',
    'ee': 'wi-night-fog',
    'ff': 'wi-night-sprinkle',
    'gg': 'wi-night-alt-thunderstorm',
    'hh': 'wi-night-rain',
    'ii': 'wi-night-alt-rain',
    'kk': 'wi-night-alt-showers',
    'll': 'wi-night-alt-sleet',
    'mm': 'wi-sleet',
    'nn': 'wi-snowflake-cold',
    'oo': 'wi-night-cloudy',
    'pp': 'wi-cloud',
    'qq': 'wi-sleet',
    'ss': 'wi-night-alt-sleet-storm',
    'tt': 'wi-snow',
    'uu': 'wi-night-alt-snow',
    'vv': 'wi-sleet',
    'ww': 'wi-rain-mix',
    'xx': 'wi-snow',
    'yy': 'wi-snow-wind',
    'zz': 'wi-snow-wind',
}

# Mapping of Dutch to English names for days of the week
DOW_MAP = {
    'ma': 'Mon',
    'di': 'Tue',
    'wo': 'Wed',
    'do': 'Thu',
    'vr': 'Fri',
    'za': 'Sat',
    'zo': 'Sun',
}


class BuienRadarDataProvider(HttpDataProvider):
    """Weather data provider taking its data from weer.nl"""

    def __init__(self, station: str):
        """Constructor. Initialises the instance.
        :type station ID of BuienRadar station to get weather data for
        """
        self.station = station

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
            "./weergegevens/actueel_weer/weerstations/weerstation[@id='{}']".format(self.station))

        # Process the current weather
        e_icon = self.get_element(e_station, 'icoonactueel')
        current = {
            'station': {
                'code':       e_station.findtext('stationcode'),
                'name':       e_station.findtext('stationnaam'),
                'latitude':   e_station.findtext('lat'),
                'longitude':  e_station.findtext('lon'),
            },
            'temperature':    e_station.findtext('temperatuurGC'),       # In °C
            'humidity':       e_station.findtext('luchtvochtigheid'),
            'pressure':       e_station.findtext('luchtdruk'),           # In hPa
            'wind': {
                'dirText':    e_station.findtext('windrichting'),        # Text, like 'WZW'
                'dirDegrees': e_station.findtext('windrichtingGR'),      # In degrees
                'speed':      e_station.findtext('windsnelheidBF'),      # In bft
                'gusts':      e_station.findtext('windstotenMS')         # In m/s
            },
            'rain':           e_station.findtext('regenMMPU'),           # In mm/h
            'visibility':     e_station.findtext('zichtmeters'),         # In metres
            'iconUrl':        e_icon.text,                               # Full URL, ie. http://...
            'iconWiClass':    self.get_wi_icon_class(e_icon.get('ID')),  # One of the wi-* classes
            'text':           e_root.findtext('./weergegevens/verwachting_vandaag/samenvatting'),
        }

        # Process the forecast
        forecast = []
        for e_day in e_root.findall('./weergegevens/verwachting_meerdaags/*[datum]'):
            e_day_icon = self.get_element(e_day, 'icoon')
            forecast.append({
                'date':            e_day.findtext('datum'),                       # Full date, eg 'zondag 17 april 2016'
                'dow':             DOW_MAP[e_day.findtext('dagweek')],            # Weekday name in English
                'probSun':         e_day.findtext('kanszon'),                     # Probability in percent
                'probSnow':        e_day.findtext('sneeuwcms'),                   # Probability in percent
                'rain': {
                    'probability': e_day.findtext('kansregen'),                   # Probability in percent
                    'minAmount':   e_day.findtext('minmmregen'),                  # Minimum amount in mm
                    'maxAmount':   e_day.findtext('maxmmregen'),                  # Maximum amount in mm
                },
                'temperature': {
                    'lowMin':      e_day.findtext('mintemp'),                     # In °C
                    'lowMax':      e_day.findtext('mintempmax'),                  # In °C
                    'highMin':     e_day.findtext('maxtemp'),                     # In °C
                    'highMax':     e_day.findtext('maxtempmax'),                  # In °C
                },
                'wind': {
                    'dirText':     e_day.findtext('windrichting'),                # Text, like 'WZW'
                    'speed':       e_day.findtext('windkracht'),                  # In bft
                },
                'iconUrl':         e_day_icon.text,                               # Full URL, ie. http://...
                'iconWiClass':     self.get_wi_icon_class(e_day_icon.get('ID')),  # One of the wi-* classes
            })

        return {
            'updated':  e_station.findtext('datum'),
            'current':  current,
            'forecast': forecast
        }

    @staticmethod
    def get_wi_icon_class(icon_id: str):
        """Return name of the weather-icon class for the given BuienRadar icon URL.
        :param icon_id: one- or two-letter icon ID
        """
        if icon_id in ICON_TO_WI_CLASS_MAP:
            return ICON_TO_WI_CLASS_MAP[icon_id]
        else:
            return 'wi-na'
