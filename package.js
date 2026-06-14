import { packager } from '@electron/packager';
import installer from 'electron-installer-debian';

async function makeDeb(src) {
    const dest = 'dist/installers/';

    // Find out the arch: it's the last component of the path, and 'x64' is translated into 'amd64'
    let arch = src.split('-').pop()
    if (arch === 'x64') {
        arch = 'amd64'
    }

    // Run the DEB maker
    try {
        await installer({src, dest, arch, compression: 'xz'});
        console.log(`Created DEB packages at ${dest}`);
    } catch (err) {
        console.error(err, err.stack);
        process.exit(1)
    }
}

async function bundle() {
    // Prepare options
    const packagerOptions = {
        arch:      ['x64', 'arm64'],
        asar:      false,
        dir:       '.',
        icon:      'src/favicon.ico',
        ignore:    [/\/\..*/, /\/node_modules/, /\/doc/, /\/src/, /\.iml$/],
        platform:  'linux',
        prune:     true,
        overwrite: true,
        out:       'dist/installers'
    };

    // Create an Electron package
    let paths;
    try {
        paths = await packager(packagerOptions);
        console.log('Electron app bundles created:')
        paths.forEach(p => console.log(` * ${p}`));
    } catch (err) {
        console.error(err, err.stack);
        process.exit(1)
    }

    // Make DEBs (all in parallel)
    await Promise.all(paths.map(p => makeDeb(p)));
}

// noinspection JSIgnoredPromiseFromCall
bundle();
