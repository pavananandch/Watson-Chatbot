const electron = require('electron')
const BrowserWindow = electron.BrowserWindow;
const session = electron;
const app = electron.app;
const Menu = electron.Menu;
const url = require('url') 
const path = require('path')
var ipcMain = electron.ipcMain;  
const ElectronOnline = require('electron-online')
const connection = new ElectronOnline()
const nativeImage = electron.nativeImage;
let demoIcon =  path.join(__dirname,'images','icon.ico')
let count =5; 
var topmenu = true;
const Store = require('electron-store');
const store = new Store();
if (handleSquirrelEvent(app)) {
    // squirrel event handled and app will exit in 1000ms, so don't do anything else
    return;
}
app.on('ready', () => {
  // create main browser window
  mainWindow = new BrowserWindow({
      width: 475,
   height: 698,
 maximizable: false,
  icon: demoIcon,
   show: true,
   frame: true,
  });
  require('electron-context-menu')({
});
mainWindow.loadURL(`file://${__dirname}/index.html`);
 mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });
/* connection.on('online', () => {
  mainWindow.webContents.send('online');
})
connection.on('offline', () => {
  mainWindow.webContents.send('offline');
}) */
console.log(connection.status)
ipcMain.on('maxmize', (event, data) => {
	console.log("maxmize")
mainWindow.show()
})
ipcMain.on('userdata', (event, data) => {
	console.log(JSON.stringify(data));
//store.set('users', data);
//console.log(store.get('users'));
})
ipcMain.on('update-badge', (event, data) => {
	console.log("data",data)
   var badge = nativeImage.createFromPath(app.getAppPath() + "/images/badges/badge-" + (data > 9 ? 0 : data) +".png");
mainWindow.setOverlayIcon(badge, 'description')
})

const menuTemplate = [
        {
            label: 'File',
			submenu: [
			{
				label: 'Logout',
				click: function(){
					console.log("logout triggered")
					mainWindow.webContents.send('test');
				}
			}
			]
        }
    ];
     const menu = Menu.buildFromTemplate(menuTemplate);

    Menu.setApplicationMenu(null);

ipcMain.on('addfile', (event, data) => {
	console.log("addfile triggered")
	Menu.setApplicationMenu(menu);
})
ipcMain.on('removefile', (event, data) => {
	console.log("addfile triggered")
	Menu.setApplicationMenu(null);
})
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });
  
  app.on('browser-window-focus', () => {
	var badge = nativeImage.createFromPath(app.getAppPath() + "/images/badges/badge-0.png");
mainWindow.setOverlayIcon(badge, 'description')
})
mainWindow.on('closed', function () {
	console.log("closed event triggered")
    mainWindow = null
	
  })
});
function handleSquirrelEvent(application) {
    if (process.argv.length === 1) {
        return false;
    }

    const ChildProcess = require('child_process');
    const path = require('path');

    const appFolder = path.resolve(process.execPath, '..');
    const rootAtomFolder = path.resolve(appFolder, '..');
    const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
    const exeName = path.basename(process.execPath);

    const spawn = function(command, args) {
        let spawnedProcess, error;

        try {
            spawnedProcess = ChildProcess.spawn(command, args, {
                detached: true
            });
        } catch (error) {}

        return spawnedProcess;
    };

    const spawnUpdate = function(args) {
        return spawn(updateDotExe, args);
    };

    const squirrelEvent = process.argv[1];
    switch (squirrelEvent) {
        case '--squirrel-install':
        case '--squirrel-updated':
            // Optionally do things such as:
            // - Add your .exe to the PATH
            // - Write to the registry for things like file associations and
            //   explorer context menus

            // Install desktop and start menu shortcuts
            spawnUpdate(['--createShortcut', exeName]);

            setTimeout(application.quit, 1000);
            return true;

        case '--squirrel-uninstall':
            // Undo anything you did in the --squirrel-install and
            // --squirrel-updated handlers

            // Remove desktop and start menu shortcuts
            spawnUpdate(['--removeShortcut', exeName]);

            setTimeout(application.quit, 1000);
            return true;

        case '--squirrel-obsolete':
            // This is called on the outgoing version of your app before
            // we update to the new version - it's the opposite of
            // --squirrel-updated

            application.quit();
            return true;
    }
};