"use strict";

const packager = require('electron-packager');
const pkg = require('./package.json');
const options = {
    dir:          './dist',
    name:         pkg.name,
    buildVersion: pkg.version,
    platform:     'linux',
    arch:         'armv7l',
    icon:         'src/favicon.ico',
    prune:        true,
    overwrite:    true,
    out:          './dist'
};


function pack() {
    packager(options, function done(err, appPath) {
        if (err) {
            console.log(err);
        } else {
            console.log('Application packaged successfuly!', appPath);
        }
    });
}

pack();
