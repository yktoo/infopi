from http.server import SimpleHTTPRequestHandler


class HomePiRequestHandler(SimpleHTTPRequestHandler):
    def __init__(self, request, client_address, server):
        super().__init__(request, client_address, server)
        self.pi_server = None

    def do_GET(self):
        if self.path != '/':
            return SimpleHTTPRequestHandler.do_GET(self)

        # Send response status code
        self.send_response(200)

        # Send headers
        self.send_header('Content-type', 'text/html')
        self.end_headers()

        # Write the response
        self.wfile.write(bytes(self.pi_server.get_html(), 'utf8'))
