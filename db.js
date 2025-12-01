// db.js
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbFolder = path.join(__dirname, 'db');

// 建立 db 資料夾（如果不存在）
if (!fs.existsSync(dbFolder)) {
    fs.mkdirSync(dbFolder);
}

const dbPath = path.join(dbFolder, 'pos.db');
const db = new sqlite3.Database(dbPath);

// === 初始化資料表 ===
db.serialize(() => {
    // 客戶資料表
    db.run(`
        CREATE TABLE IF NOT EXISTS customers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // 訂單資料表
    db.run(`
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            customer_id INTEGER,
            item TEXT,
            price INTEGER,
            status TEXT DEFAULT 'pending',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (customer_id) REFERENCES customers(id)
        )
    `);
});

// === 客戶功能 ===
module.exports.addCustomer = (name, phone) => {
    return new Promise((resolve, reject) => {
        db.run(
            `INSERT INTO customers (name, phone) VALUES (?, ?)`,
            [name, phone],
            function (err) {
                if (err) reject(err);
                else resolve({ id: this.lastID });
            }
        );
    });
};

module.exports.findCustomer = (keyword) => {
    return new Promise((resolve, reject) => {
        db.all(
            `SELECT * FROM customers WHERE name LIKE ? OR phone LIKE ?`,
            [`%${keyword}%`, `%${keyword}%`],
            (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            }
        );
    });
};

// === 訂單功能 ===
module.exports.addOrder = (customer_id, item, price) => {
    return new Promise((resolve, reject) => {
        db.run(
            `INSERT INTO orders (customer_id, item, price) VALUES (?, ?, ?)`,
            [customer_id, item, price],
            function (err) {
                if (err) reject(err);
                else resolve({ id: this.lastID });
            }
        );
    });
};

module.exports.getOrders = () => {
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM orders ORDER BY id DESC`, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

