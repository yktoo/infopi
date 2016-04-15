import re
import json
from http.server import SimpleHTTPRequestHandler

from provider.ns import NSDepartureTimesProvider
from provider.weather import WeatherDataProvider

# Array of route-provider mappings
ROUTE_MAP = [
    # NS departure times: /ns/dep/<station_code>
    {'route': '/ns/dep/([a-z]+)', 'handler': NSDepartureTimesProvider},
    # Weather: /weather/<city_id>
    {'route': '/weather/(\d+)', 'handler': WeatherDataProvider},
]


class HomePiRequestHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        # Iterate through defined routes to find the appropriate one
        handled = False
        data = None
        for entry in ROUTE_MAP:
            match = re.match(entry['route'], self.path)
            if match is not None:
                handled = True
                data = entry['handler'](match.group(1)).get()
                break

        # No match found, consider it's a static resource: hand over to the original handler
        if not handled:
            return SimpleHTTPRequestHandler.do_GET(self)

        # Send response status code
        self.send_response(200)

        # Send headers
        self.send_header('Content-type', 'application/json')
        self.end_headers()

        # Write the response
        self.wfile.write(bytes(json.dumps(data), 'utf8'))
