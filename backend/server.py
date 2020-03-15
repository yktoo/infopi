import logging
from http.server import HTTPServer

from .req_handler import InfoPiRequestHandler


class InfoPiServer:
    """The main component of the system."""

    def __init__(self):
        """Constructor"""
        # Instantiate an HTTP server
        self.http_server = HTTPServer(('', 8000), InfoPiRequestHandler)

    def run(self):
        """Run the server indefinitely."""
        logging.info('Running server...')
        self.http_server.serve_forever()
