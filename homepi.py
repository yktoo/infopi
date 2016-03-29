#!/usr/bin/env python3
import time
from http.server import BaseHTTPRequestHandler, HTTPServer

from data_provider import NSDepartureTimesProvider

HTML_PAGE = '''<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="refresh" content="30">
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" rel="stylesheet">
        <style>
            body, html {{
                width: 100%;
                height: 100%;
            }}
            .container, .row {{
                height: 100%;
            }}
            .m-hidden {{
                display: none;
            }}
            .avt__delay {{
                color: #f00;
                font-weight: bold;
                padding-left: 4px;
            }}
            .avt__platform {{
                font-size: 130%;
                font-weight: bold;
                text-align: center;
            }}
            .data-block {{
                max-height: 50%;
                overflow: hidden;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="row">
                <div class="col-md-6 data-block">
                    <h1>Houten Castellum — {time}</h1>
                    {houtenc}
                </div>
                <div class="col-md-6 data-block">
                    <h1>Utrecht — {time}</h1>
                    {utrecht}
                </div>
            </div>
        </div>
    </body>
</html>
'''


# HTTPRequestHandler class
class HomePiRequestHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path != '/':
            self.send_response(404)
            self.send_header('Content-type', 'text/plain')
            self.end_headers()
            self.wfile.write(bytes('404 Page Not Found', 'utf8'))
            return

        # Send response status code
        self.send_response(200)

        # Send headers
        self.send_header('Content-type', 'text/html')
        self.end_headers()

        # Fetch the data
        times_houtenc = NSDepartureTimesProvider('htnc').fetch()
        times_utrecht = NSDepartureTimesProvider('ut').fetch()

        args = {
            'time': time.strftime('%H:%M'),
            'houtenc': times_houtenc,
            'utrecht': times_utrecht,
        }

        # Write the response
        self.wfile.write(bytes(HTML_PAGE.format(**args), 'utf8'))


def run():
    print('Starting server...')

    # Server settings
    # Choose port 8080, for port 80, which is normally used for a http server, you need root access
    server_address = ('', 8000)
    httpd = HTTPServer(server_address, HomePiRequestHandler)
    print('Running server...')
    httpd.serve_forever()


run()
