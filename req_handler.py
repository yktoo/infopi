import json
import urllib.parse
from http.server import SimpleHTTPRequestHandler

from provider.ns import NSDepartureTimesProvider, NSTravelAdviceProvider
from provider.buienradar import BuienRadarDataProvider

# Route-to-handler mappings
ROUTE_MAP = {
    '/ns/dep-times':     NSDepartureTimesProvider,
    '/ns/travel-advice': NSTravelAdviceProvider,
    '/buienradar':       BuienRadarDataProvider,
}


class HomePiRequestHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        # Parse the request
        url_components = urllib.parse.urlsplit(self.path)
        url_path = url_components[2]

        # Parse the query string
        url_params = urllib.parse.parse_qs(url_components[3])
        # De-list single-item value lists
        for name, value in url_params.items():
            if type(value) is list and len(value) == 1:
                url_params[name] = value[0]

        # No appropriate handler found, consider it's a static resource: hand over to the original handler
        if url_path not in ROUTE_MAP:
            return SimpleHTTPRequestHandler.do_GET(self)

        # Instantiate and run the handler
        data = ROUTE_MAP[url_path](**url_params).get()

        # Send response status code
        self.send_response(200)

        # Send headers
        self.send_header('Content-type', 'application/json')
        self.end_headers()

        # Write the response
        self.wfile.write(bytes(json.dumps(data), 'utf8'))
