"use strict";

const packager = require('electron-packager');
const installer = require('electron-installer-debian');

let platform;
let arch;
let archDeb = 'amd64';

// The first command line argument can be 'rpi'
if (process.argv.length > 2 && process.argv[2] === 'rpi') {
    platform = 'linux';
    arch = 'armv7l';
    archDeb = 'armhf';
}

async function makeDeb(path) {
    let installerOptions = {
        src: path,
        dest: 'dist/installers/',
        arch: archDeb,
    };

    try {
        await installer(installerOptions);
        console.log(`Successfully created DEB package at ${installerOptions.dest}`);
    } catch (err) {
        console.error(err, err.stack);
        process.exit(1)
    }
}

async function bundle() {
    // Prepare options
    let packagerOptions = {
        arch:      arch,
        asar:      false,
        dir:       '.',
        icon:      'src/favicon.ico',
        ignore:    ['/\\.idea', '/node_modules', '/doc', '/e2e', '/src', '\\.iml$'],
        platform:  platform,
        prune:     true,
        overwrite: true,
        out:       'dist/installers'
    };

    // Create an Electron package
    let paths;
    try {
        paths = await packager(packagerOptions);
        console.log(`Electron app bundles created:\n${paths.join("\n")}`)
    } catch (err) {
        console.error(err, err.stack);
        process.exit(1)
    }

    // Make a DEB
    await makeDeb(paths[0]);
}

bundle();
