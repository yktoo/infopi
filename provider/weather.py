import re

from .http import HttpDataProvider


class WeatherDataProvider(HttpDataProvider):
    """Weather data provider taking its data from weer.nl"""

    def __init__(self, city_id: str):
        """Constructor. Initialises the instance.
        :type city_id ID of the city to get weather data for
        """
        self.city_id = city_id

    def get_url(self):
        return 'http://www.weer.nl/verwachting/nederland/placeholder/{}/'.format(self.city_id)

    def process_data(self, data: str):
        match = re.search(
            r'<li class="temp">\s*'
                r'<img\b[^>]*\bsrc="([^"]+)"[^>]*>'
                r'.*?'
                r'<div class="wind-container">\s*'
                r'<img\b[^>]*\bstyle="transform:rotate\((\d+)deg\)[^>]*>\s*</div>\s*'
                r'(\d+)\s*<span class="wmes">\s*([^< ]+)\s*</span>'
                r'.*?'
                r'<span class="rainval">\s*'
                r'<img\b[^>]*>\s*'
                r'(\d+)<span class="wmes">\s*([^< ]+)\s*</span>'
                r'.*?'
                r'<span class="temp">\s*'
                r'<span class="temp_val">(\d+) ([^<]+)</span>.*?'
                r'<li class="details">.*?'
                r'Gevoelstemp\..*?<span class="value">\s*(\d+).*?'
                r'Dauwpunt.*?<span class="value">\s*(\d+).*?'
                r'Rel\. Luchtv\..*?<span class="value">\s*(\d+).*?'
                r'Luchtdruk.*?<span class="value">\s*(\d+)\s*<span class="wmes">\s*([^< ]+)\s*</span>.*?'
                r'Stoten.*?<span class="value">\s*(\d+)\s*<span class="wmes">\s*([^< ]+)\s*</span>.*?'
                r'</ul>',
            data,
            re.DOTALL)
        if match is None:
            return None

        return {
            'current': {
                'temp': {
                    'units':     match.group(8),
                    'actual':    match.group(7),
                    'perceived': match.group(9),
                    'dewPoint':  match.group(10)
                },
                'humidity': match.group(11),
                'pressure': {
                    'units': match.group(13),
                    'value': match.group(12)
                },
                'wind': {
                    'units':     match.group(4),
                    'direction': self.wind_direction(match.group(2)),
                    'speed':     match.group(3),
                    'gusts':     match.group(14),
                    'gustUnits': match.group(15)
                },
                'rain': {
                    'units': match.group(6),
                    'value': match.group(5)
                },
                'icon': match.group(1)
            }
        }

    @staticmethod
    def wind_direction(degrees):
        """ Convert wind degrees to direction. Borrowed from pywapi.
        :param degrees: Direction in degrees
        """
        try:
            deg = int(degrees)
        except ValueError:
            return ''

        if deg < 23 or deg >= 338:
            return 'N'
        elif deg < 68:
            return 'NE'
        elif deg < 113:
            return 'E'
        elif deg < 158:
            return 'SE'
        elif deg < 203:
            return 'S'
        elif deg < 248:
            return 'SW'
        elif deg < 293:
            return 'W'
        elif deg < 338:
            return 'NW'
