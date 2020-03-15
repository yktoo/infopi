from abc import ABCMeta, abstractmethod
import dateutil.parser


class DataProvider(metaclass=ABCMeta):
    """Abstract data provider that can fetch and return some data to be displayed."""

    @abstractmethod
    def get(self):
        """Return data provided by the instance of the class as an object. Should return None if data fetching failed
        for any reason.
        """

    @staticmethod
    def calc_delay(planned: str, actual: str):
        """Calculate a delay in minutes between two dates given as ISO8601 strings.
        :param planned: Planned time as an ISO8601 string.
        :param actual: Actual time as an ISO8601 string.
        :return: Delay in minutes, either an empty string (delay <=0) or a string in format '+XXX'.
        """
        d_planned = dateutil.parser.parse(planned)
        d_actual  = dateutil.parser.parse(actual)
        diff = round((d_actual - d_planned).total_seconds() / 60)
        return '' if diff <= 0 else '+' + str(diff)
