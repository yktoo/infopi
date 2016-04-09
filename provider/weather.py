import datetime

import pywapi
import time

from .data_provider import DataProvider


class WeatherDataProvider(DataProvider):
    """Data provider that returns weather condition information."""

    # Weather update interval in seconds (30 min)
    UPDATE_INTERVAL = 60 * 30

    def __init__(self, city_id: str):
        """Constructor. Initialises the instance.
        :type city_id ID of the city to get weather data for
        """
        self.city_id = city_id
        self.last_updated = 0
        self.last_data = None

    def get(self):
        # Don't update the weather more often than once in UPDATE_INTERVAL seconds
        cur_time = int(time.time())
        if self.last_data is None or cur_time - self.last_updated > WeatherDataProvider.UPDATE_INTERVAL:
            # First try weather.com
            data = self.get_weather_com()

            # Then try Yahoo!
            if data is None:
                data = self.get_yahoo()

            # If everything failed
            if data is None:
                data = self.get_fallback()

            # Add last update timestamp
            data['updated'] = datetime.datetime.fromtimestamp(cur_time).strftime('%H:%M:%S')

            # Cache the value
            self.last_data = data
            self.last_updated = cur_time

        return self.last_data

    def get_weather_com(self) -> dict:
        """Fetches and returns weather data from weather.com in a uniform format as a dictionary. If failed, returns
        None.
        """
        data = None

        # Try to fetch weather data from weather.com
        try:
            d = pywapi.get_weather_from_weather_com(self.city_id)
        except:
            # On a failure set data to None
            d = None

        # Convert the response to a uniform format
        if d is not None:
            units = d['units']
            cur   = d['current_conditions']
            baro  = cur['barometer']
            wind  = cur['wind']
            data = {
                'provider': 'weather.com',
                'current': {
                    'feels': cur['feels_like'],
                    'wind': {
                        'text':  wind['text'],
                        'speed': pywapi.wind_beaufort_scale(wind['speed']),
                    },
                    'pressure': {
                        'dir':   baro['direction'],
                        'value': baro['reading']
                    },
                    'temp':     cur['temperature'],
                    'icon':     cur['icon'],
                    'humidity': cur['humidity'],
                    'text':     cur['text']
                },
                'units': {
                    'temp':     units['temperature'],
                    'speed':    units['speed'],
                    'pressure': units['pressure']
                },
            }

        return data

    def get_yahoo(self) -> dict:
        """Fetches and returns weather data from Yahoo! in a uniform format as a dictionary. If failed, returns None.
        """
        data = None

        # Try to fetch weather data from Yahoo!
        try:
            d = pywapi.get_weather_from_yahoo(self.city_id)
        except:
            # On a failure set data to None
            d = None

        # Convert the response to a uniform format
        if d is not None:
            units = d['units']
            atmo  = d['atmosphere']
            cur   = d['condition']
            wind  = d['wind']
            data = {
                'provider': 'Yahoo!',
                'current': {
                    'feels': wind['chill'],
                    'wind': {
                        'text':  pywapi.wind_direction(wind['direction']),
                        'speed': pywapi.wind_beaufort_scale('0' if wind['speed'] == '' else wind['speed']),
                    },
                    'pressure': {
                        'dir':   atmo['rising'],
                        'value': atmo['pressure']
                    },
                    'temp':     cur['temp'],
                    'icon':     cur['code'],
                    'humidity': atmo['humidity'],
                    'text':     cur['text']
                },
                'units': {
                    'temp':     units['temperature'],
                    'speed':    units['speed'],
                    'pressure': units['pressure']
                },
            }

        return data

    @staticmethod
    def get_fallback() -> dict:
        """Returns a fallback weather data structure."""
        return {
            'provider': 'N/A',
            'current': {
                'feels': '',
                'wind': {
                    'text':  '',
                    'speed': '',
                },
                'pressure': {
                    'dir':   '',
                    'value': ''
                },
                'temp':     'N/A',
                'icon':     'na',
                'humidity': '',
                'text':     '(not available)'
            },
            'units': {
                'temp':     '',
                'speed':    '',
                'pressure': ''
            },
        }
