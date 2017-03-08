from datetime import date, datetime
from xml.etree import ElementTree
from astral import Astral

from .http import HttpDataProvider

ICON_TO_WI_CLASS_MAP = {
    # Day
    'a':  'wi-day-sunny',
    'b':  'wi-day-sunny-overcast',
    'c':  'wi-cloud',
    'd':  'wi-day-cloudy-windy',
    'e':  'wi-day-fog',
    'f':  'wi-day-sprinkle',
    'g':  'wi-day-thunderstorm',
    'h':  'wi-day-rain',
    'i':  'wi-day-rain',
    'j':  'wi-day-sunny-overcast',
    'k':  'wi-day-showers',
    'l':  'wi-day-sleet',
    'm':  'wi-sleet',
    'n':  'wi-snowflake-cold',
    'o':  'wi-day-cloudy',
    'p':  'wi-cloud',
    'q':  'wi-sleet',
    'r':  'wi-day-cloudy',
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
    'cc': 'wi-night-cloudy',
    'dd': 'wi-night-alt-cloudy-windy',
    'ee': 'wi-night-fog',
    'ff': 'wi-night-sprinkle',
    'gg': 'wi-night-alt-thunderstorm',
    'hh': 'wi-night-rain',
    'ii': 'wi-night-alt-rain',
    'jj': 'wi-night-alt-cloudy',
    'kk': 'wi-night-alt-showers',
    'll': 'wi-night-alt-sleet',
    'mm': 'wi-sleet',
    'nn': 'wi-snowflake-cold',
    'oo': 'wi-night-cloudy',
    'pp': 'wi-cloud',
    'qq': 'wi-sleet',
    'rr': 'wi-night-alt-cloudy',
    'ss': 'wi-night-alt-sleet-storm',
    'tt': 'wi-snow',
    'uu': 'wi-night-alt-snow',
    'vv': 'wi-sleet',
    'ww': 'wi-rain-mix',
    'xx': 'wi-snow',
    'yy': 'wi-snow-wind',
    'zz': 'wi-snow-wind',
}

MOON_PHASE_MAP = [
    {'text': 'New',             'wicls': 'wi-moon-new'},
    {'text': 'Waxing crescent', 'wicls': 'wi-moon-waxing-crescent-1'},
    {'text': 'Waxing crescent', 'wicls': 'wi-moon-waxing-crescent-2'},
    {'text': 'Waxing crescent', 'wicls': 'wi-moon-waxing-crescent-3'},
    {'text': 'Waxing crescent', 'wicls': 'wi-moon-waxing-crescent-4'},
    {'text': 'Waxing crescent', 'wicls': 'wi-moon-waxing-crescent-5'},
    {'text': 'Waxing crescent', 'wicls': 'wi-moon-waxing-crescent-6'},
    {'text': 'First quarter',   'wicls': 'wi-moon-first-quarter'},
    {'text': 'Waxing gibbous',  'wicls': 'wi-moon-waxing-gibbous-1'},
    {'text': 'Waxing gibbous',  'wicls': 'wi-moon-waxing-gibbous-2'},
    {'text': 'Waxing gibbous',  'wicls': 'wi-moon-waxing-gibbous-3'},
    {'text': 'Waxing gibbous',  'wicls': 'wi-moon-waxing-gibbous-4'},
    {'text': 'Waxing gibbous',  'wicls': 'wi-moon-waxing-gibbous-5'},
    {'text': 'Waxing gibbous',  'wicls': 'wi-moon-waxing-gibbous-6'},
    {'text': 'Full',            'wicls': 'wi-moon-full'},
    {'text': 'Waning gibbous',  'wicls': 'wi-moon-waning-gibbous-1'},
    {'text': 'Waning gibbous',  'wicls': 'wi-moon-waning-gibbous-2'},
    {'text': 'Waning gibbous',  'wicls': 'wi-moon-waning-gibbous-3'},
    {'text': 'Waning gibbous',  'wicls': 'wi-moon-waning-gibbous-4'},
    {'text': 'Waning gibbous',  'wicls': 'wi-moon-waning-gibbous-5'},
    {'text': 'Waning gibbous',  'wicls': 'wi-moon-waning-gibbous-6'},
    {'text': 'Third quarter',   'wicls': 'wi-moon-third-quarter'},
    {'text': 'Waning crescent', 'wicls': 'wi-moon-waning-crescent-1'},
    {'text': 'Waning crescent', 'wicls': 'wi-moon-waning-crescent-2'},
    {'text': 'Waning crescent', 'wicls': 'wi-moon-waning-crescent-3'},
    {'text': 'Waning crescent', 'wicls': 'wi-moon-waning-crescent-4'},
    {'text': 'Waning crescent', 'wicls': 'wi-moon-waning-crescent-5'},
    {'text': 'Waning crescent', 'wicls': 'wi-moon-waning-crescent-6'},
]

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

    def get_url(self):
        return 'http://xml.buienradar.nl/'

    def process_data(self, data: str):
        # Parse the XML
        e_root = ElementTree.fromstring(data)

        # Sanity check
        if e_root.tag != 'buienradarnl':
            raise LookupError('Root XML node is not <buienradarnl>')

        e_station = get_element(
            e_root,
            "./weergegevens/actueel_weer/weerstations/weerstation[@id='{}']".format(self.station))

        # Process the current weather
        e_icon = get_element(e_station, 'icoonactueel')
        current = {
            'station': {
                'code':       e_station.findtext('stationcode'),
                'name':       e_station.findtext('stationnaam'),
                'latitude':   e_station.findtext('lat'),
                'longitude':  e_station.findtext('lon'),
                'updated':    iso_datetime(e_station.findtext('datum')),
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
            'iconText':       e_icon.get('zin'),                       # In Dutch
            'iconWiClass':    get_wi_icon_class(e_icon.get('ID')),     # One of the wi-* classes
            'text':           e_root.findtext('./weergegevens/verwachting_vandaag/samenvatting'),
        }

        # Process the forecast
        forecast = []
        for e_day in e_root.findall('./weergegevens/verwachting_meerdaags/*[datum]'):
            e_day_icon = get_element(e_day, 'icoon')
            forecast.append({
                'date':            e_day.findtext('datum'),                  # Full date, eg 'zondag 17 april 2016'
                'dow':             DOW_MAP[e_day.findtext('dagweek')],       # Weekday name in English
                'probSun':         e_day.findtext('kanszon'),                # Probability in percent
                'probSnow':        e_day.findtext('sneeuwcms'),              # Probability in percent
                'rain': {
                    'probability': e_day.findtext('kansregen'),              # Probability in percent
                    'minAmount':   e_day.findtext('minmmregen'),             # Minimum amount in mm
                    'maxAmount':   e_day.findtext('maxmmregen'),             # Maximum amount in mm
                },
                'temperature': {
                    'lowMin':      e_day.findtext('mintemp'),                # In °C
                    'lowMax':      e_day.findtext('mintempmax'),             # In °C
                    'highMin':     e_day.findtext('maxtemp'),                # In °C
                    'highMax':     e_day.findtext('maxtempmax'),             # In °C
                },
                'wind': {
                    'dirText':     e_day.findtext('windrichting'),           # Text, like 'WZW'
                    'speed':       e_day.findtext('windkracht'),             # In bft
                },
                'iconUrl':         e_day_icon.text,                          # Full URL, ie. http://...
                'iconWiClass':     get_wi_icon_class(e_day_icon.get('ID')),  # One of the wi-* classes
            })

        # Process sunrise/sunset
        e_buienradar = get_element(e_root, './weergegevens/actueel_weer/buienradar')
        moon_phase = Astral().moon_phase(date.today())
        sunmoon = {
            'sunrise':          iso_datetime(e_buienradar.findtext('zonopkomst')),  # ISO8601 sunrise time
            'sunset':           iso_datetime(e_buienradar.findtext('zononder')),    # ISO8601 sunset time
            'moonPhase':        moon_phase,                                         # Moon phase in days (0..27)
            'moonPhaseText':    get_moon_text(moon_phase),                          # Textual description
            'moonPhaseWiClass': get_moon_wi_icon_class(moon_phase),                 # One of the wi-* classes
        }

        return {
            'updated':  iso_datetime(e_station.findtext('datum')),
            'current':  current,
            'forecast': forecast,
            'sunMoon':  sunmoon
        }


def get_element(parent, path: str):
    """Finds and returns the first element by given XPath, or raises an exception if not found.
    :param parent: Parent element
    :param path: Tag name or path expression
    """
    el = parent.find(path)
    if el is None:
        raise LookupError('Element {} doesn\'t have a child matching path "{}"'.format(parent.tag, path))
    return el


def get_wi_icon_class(icon_id: str):
    """Return name of the weather-icon class for the given BuienRadar icon URL.
    :param icon_id: one- or two-letter icon ID
    :return: wi-* class name
    """
    if icon_id in ICON_TO_WI_CLASS_MAP:
        return ICON_TO_WI_CLASS_MAP[icon_id]
    else:
        return 'wi-na'


def get_moon_text(moon_phase: int) -> str:
    """Return textual name of a moon phase.
    :param moon_phase: moon phase in days (0..27)
    :return: Phase name
    """
    return MOON_PHASE_MAP[moon_phase]['text'] if 0 <= moon_phase <= 27 else ''


def get_moon_wi_icon_class(moon_phase: int) -> str:
    """Return name of the weather-icon class corresponding to a moon phase.
    :param moon_phase: moon phase in days (0..27)
    :return: wi-* class name or empty string if the phase is incorrect
    """
    return MOON_PHASE_MAP[moon_phase]['wicls'] if 0 <= moon_phase <= 27 else ''


def iso_datetime(dt: str) -> str:
    """Convert BuienRadar's datetime representation into ISO8601.
    :param dt: date and time in BuienRadar's format
    :return: date and time string in the ISO8601 format
    """
    return datetime.strptime(dt.replace('/', '-'), '%m-%d-%Y %H:%M:%S').isoformat()
