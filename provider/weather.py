import pywapi

from .data_provider import DataProvider


class WeatherDataProvider(DataProvider):
    """Data provider that returns weather condition information."""

    def __init__(self, city_id: str):
        """Constructor. Initialises the instance.
        :type city_id ID of the city to get weather data for
        """
        self.city_id = city_id

    def get(self):
        return pywapi.get_weather_from_weather_com(self.city_id)
