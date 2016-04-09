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
        data = pywapi.get_weather_from_weather_com(self.city_id)

        # Convert wind speed from km/h to beaufort
        data['current_conditions']['wind']['speedbft'] = pywapi.wind_beaufort_scale(
            data['current_conditions']['wind']['speed'])
        return data
