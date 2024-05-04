// database.js
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('database.db');

// Create a table
db.run(
  `CREATE TABLE IF NOT EXISTS products (
    id INT PRIMARY KEY,
    title VARCHAR(255),
    price DECIMAL(10, 2),
    description TEXT,
    category VARCHAR(255),
    image VARCHAR(255),
    sold BOOLEAN,
    dateOfSale TIMESTAMP
)`,
  (err) => {
    if (err) {
      console.error('Error creating table:', err.message);
    } else {
      console.log('Users table created successfully.');
    }
  }
);

module.exports = db;
