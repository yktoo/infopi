#!/usr/bin/env python3
import re
import time
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.request import urlopen

HTML_PAGE = \
'''<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="refresh" content="30">
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" rel="stylesheet">
        <style>
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
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Houten Castellum — {}</h1>
            <table class="table table-striped">
                {}
            </table>
        </div>
    </body>
</html>
'''

# HTTPRequestHandler class
class testHTTPServer_RequestHandler(BaseHTTPRequestHandler):
    # GET
    def do_GET(self):

        # Send response status code
        self.send_response(200)

        # Send headers
        self.send_header('Content-type', 'text/html')
        self.end_headers()

        # Scrap the NS page
        html = urlopen('http://www.ns.nl/actuele-vertrektijden/avt?station=htnc').read().decode('utf-8')

        # Extract the time table
        match = re.search(r'<table class="avt_table">(.+?)</table>', html, flags=re.DOTALL)
        if match:
            response = match.group(1)
        else:
            response = ':('

        # Write the response
        self.wfile.write(bytes(HTML_PAGE.format(time.strftime('%H:%M'), response), 'utf8'))

def run():
    print('starting server...')

    # Server settings
    # Choose port 8080, for port 80, which is normally used for a http server, you need root access
    server_address = ('', 8000)
    httpd = HTTPServer(server_address, testHTTPServer_RequestHandler)
    print('running server...')
    httpd.serve_forever()


run()
