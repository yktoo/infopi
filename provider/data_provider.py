from abc import ABCMeta, abstractmethod


class DataProvider(metaclass=ABCMeta):
    """Abstract data provider that can fetch and return some data to be displayed."""

    @abstractmethod
    def get(self):
        """Return data provided by the instance of the class as an object. Should return None if data fetching failed
        for any reason.
        """
