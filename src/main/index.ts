import { app, shell, BrowserWindow, ipcMain, safeStorage, screen, Tray, Menu } from 'electron';
import { join } from 'path';
import autoLAunch from "auto-launch";
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import icon from '../../resources/icon.png?asset';
import wifi from "node-wifi-2.0";

wifi.init({
    iface: null
});

const autoLauncher = new autoLAunch({
    name: "NetworkSwitcher"
});

let mainWindow: BrowserWindow;


function createWindow(): void {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 500,
        height: 140,
        show: false,
        autoHideMenuBar: true,
        transparent: true,
        frame: false,
        //resizable: false,
        maximizable: false,
        fullscreenable: false,
        skipTaskbar: true,
        closable: false,
        ...(process.platform === 'linux' ? { icon } : {}),
        webPreferences: {
            preload: join(__dirname, '../preload/index.js'),
            sandbox: false
        }
    });

    mainWindow.on('ready-to-show', () => {
        mainWindow.show()
    });

    mainWindow.webContents.setWindowOpenHandler((details) => {
        shell.openExternal(details.url)
        return { action: 'deny' }
    });

    // HMR for renderer base on electron-vite cli.
    // Load the remote URL for development or the local html file for production.
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
        mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
    } else {
        mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
    }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    // Set app user model id for windows
    electronApp.setAppUserModelId('com.electron');

    createWindow();

    const tray = new Tray(icon);
    tray.setToolTip("Network Switcher");
    tray.on('click', () => {
        mainWindow.show();
    });
    const trayMenu = Menu.buildFromTemplate([
        { label: "Show Window", click: () => mainWindow.show() },
        { label: "Quit Application", click: () => process.exit(0) }
    ]);
    tray.setContextMenu(trayMenu);

    // Default open or close DevTools by F12 in development
    // and ignore CommandOrControl + R in production.
    // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
    app.on('browser-window-created', (_, window) => {
        optimizer.watchWindowShortcuts(window)
    })

    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    });

    app.on("window-all-closed", (e) => {
        e.preventDefault()
    })
});

ipcMain.on("initSwitcherWindow", (e) => {

    wifi.getCurrentConnections((err, currentConnections) => {
        const currentSSID = currentConnections[0].bssid;

        e.sender.send("currentConnection", currentSSID);
    });
});

ipcMain.on("connect", (e, args) => {
    const data = JSON.parse(args);
    console.log(data);

    if (!data.password || data.password.length == 0) {
        wifi.connect({ ssid: data.SSID, password: "" });
    } else {
        const encryptedKey = safeStorage.decryptString(Buffer.from(data.password));

        wifi.connect({ ssid: data.SSID, password: encryptedKey })
    }
});

ipcMain.on("encrypt", (e, data) => {
    e.returnValue = safeStorage.encryptString(data);
});

ipcMain.on("resize", (e, size) => {
    const win = BrowserWindow.fromWebContents(e.sender);
    if (size == "large") {
        win?.setSize(500, 720);
        win?.setSkipTaskbar(false);
        console.log("large");

    }
    else if (typeof size == "object") win?.setSize(size[0], size[1]);
    else {
        win?.setResizable(true);
        win?.setSize(500, 140);
        win?.setSkipTaskbar(true);
        win?.setResizable(false);

    };
});

ipcMain.on("position", (e, position) => {
    const win = BrowserWindow.fromWebContents(e.sender);
    if (position == "center") win?.center();
    else win?.setPosition(position[0], position[1]);
});

ipcMain.on("getPosition", e => {
    const win = BrowserWindow.fromWebContents(e.sender);
    e.returnValue = win?.getPosition();
});

ipcMain.on("checkAutolaunch", async e => {
    e.returnValue = await autoLauncher.isEnabled();
});

ipcMain.on("setAutolaunch", (e, value) => {
    if (value === true) autoLauncher.enable();
    else autoLauncher.disable();
});

ipcMain.on("pin", (e, value) => {
    const win = BrowserWindow.fromWebContents(e.sender);
    win?.setAlwaysOnTop(value);
});

ipcMain.on("hide", e => {
    const win = BrowserWindow.fromWebContents(e.sender);
    win?.hide();
})

ipcMain.on("quit", () => {
    app.quit();
    process.exit(0);
})
