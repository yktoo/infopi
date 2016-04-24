InfoPi Information server application
=====================================

Represents a single-page web application that displays various live data, like weather forecast and train departure
times.

The back-end (web server) part is using Python 3.

The front-end is written on AngularJS.


Dependencies
============

1. Python 3.4
2. dateutil
3. Astral 1.0 (used for displaying moon phases)


Getting started
===============

1. Clone the `infopi` git repo
2. Clone the required submodule:

    git submodule init
    git submodule update

3. Install `dateutil`. In Ubuntu/Debian:

    sudo apt-get install python3-dateutil

4. Install `astral`:

    pip3 install astral

5. Request an NS API key [here](http://www.ns.nl/en/travel-information/ns-api)
6. Once you have the key, open the file `ns_api_key.sample.py`, update the properties and save it as `ns_api_key.py`
7. Start the server:

    ./infopi

8. Open a web browser and direct it to [localhost:8000](http://localhost:8000/). If you're using Chrome or Chromium,
   the command line is:

   chromium-browser --incognito --kiosk http://localhost:8000/
