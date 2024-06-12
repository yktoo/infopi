const { app, BrowserWindow } = require("electron");
const path = require("path");
const url = require("url");

let win;

function loadApp() {
    // Load the dist folder from Angular
    return win.loadURL(
        url.format({
            pathname: path.join(__dirname, `/dist/index.html`),
            protocol: "file:",
            slashes: true
        })
    );
}

function createWindow() {
    win = new BrowserWindow({
        kiosk: true,
        webPreferences: {
            // Disable CORS policy enforcement
            webSecurity: false,
            sandbox: false,
        },
    });

    // Reset cache
    (process.argv.indexOf("--nocache") >= 0 ?
            win.webContents.session.clearCache() :
            Promise.resolve())
        // Open developer tools in the debug mode
        .then(function() {
            if (process.argv.indexOf("--debug") >= 0) {
                win.webContents.openDevTools();
            }
        })
        // Load the application
        .then(loadApp)

    win.on("closed", () => {
        win = null;
    });
}

app.on("ready", createWindow);

// on macOS, closing the window doesn't quit the app
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

// initialize the app's main window
app.on("activate", () => {
    if (win === null) {
        createWindow();
    }
});
