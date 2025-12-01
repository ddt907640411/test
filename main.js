const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

const db = require('./db.js'); // <--- 連到 SQLite 模組

function createWindow() {
    const win = new BrowserWindow({
        width: 1000,
        height: 700,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    win.loadFile('index.html');
}

app.whenReady().then(createWindow);

// IPC（前端→後端）
ipcMain.handle('add-customer', async (event, name, phone) => {
    return await db.addCustomer(name, phone);
});

ipcMain.handle('search-customer', async (event, keyword) => {
    return await db.findCustomer(keyword);
});

ipcMain.handle('add-order', async (event, customer_id, item, price) => {
    return await db.addOrder(customer_id, item, price);
});

ipcMain.handle('get-orders', async () => {
    return await db.getOrders();
});

