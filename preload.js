const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    addCustomer: (n, p) => ipcRenderer.invoke('add-customer', n, p),
    searchCustomer: (kw) => ipcRenderer.invoke('search-customer', kw),
    addOrder: (cid, item, price) => ipcRenderer.invoke('add-order', cid, item, price),
    getOrders: () => ipcRenderer.invoke('get-orders')
});

