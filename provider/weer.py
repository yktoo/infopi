import re

from .http import HttpDataProvider


class WeerNlProvider(HttpDataProvider):
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
                r'<img\b[^>]*\bstyle="transform:rotate\((\d+)deg\)[^>]*>\s*'
                r'</div>\s*'
                r'(\d+)\s*<span class="wmes"> Bft</span>'
                r'.*?'
                r'<span class="rainval">\s*'
                r'<img\b[^>]*>\s*'
                r'(\d+)<span class="wmes"> mm/h</span>'
                r'.*?'
                r'<span class="temp">\s*'
                r'<span class="temp_val">(\d+)\b.*?'
                r'<li class="details">.*?'
                r'Gevoelstemp\..*?<span class="value">\s*(\d+).*?'
                r'Rel\. Luchtv\..*?<span class="value">\s*(\d+).*?'
                r'Luchtdruk.*?<span class="value">\s*(\d+).*?'
                r'Stoten.*?<span class="value">\s*(\d+).*?'
                r'</ul>',
            data,
            re.DOTALL)
        if match is None:
            return None

        return {
            'provider': 'weer.nl',
            'current': {
                'feels': match.group(6),
                'wind': {
                    'text': match.group(2),  # Degrees
                    'speed': match.group(3)
                },
                'pressure': {
                    'dir': '',  # TODO
                    'value': match.group(9)
                },
                'temp':     match.group(5),
                'icon':     match.group(1),
                'humidity': match.group(7),
                'text':     ''  # TODO
            },
            'units': {
                'temp':     'C',
                'speed':    'bft',
                'pressure': 'hPa'
            },
        }
