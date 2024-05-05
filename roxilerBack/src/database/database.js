// database.js
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('products.db');

require('dotenv').config();

const fetch = require('node-fetch');

const json = require('../../product_transaction.json');

const url = process.env.PRIMARY_DATA;

// Create a table
db.run(
  `CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY,
    title TEXT ,
    price INTEGER ,
    description TEXT,
    category TEXT,
    image TEXT,
    sold INTEGER DEFAULT 0,
    dateOfSale TEXT
);`,
  (err) => {
    if (err) {
      console.error('Error creating table:', err.message);
    } else {
      console.log('Users table created successfully.');
    }
  }
);

const fetchData = fetch(url)
  .then((response) => {
    console.log(response.ok);
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    return response.json();
  })
  .then((data) => {
    // console.log(data)
    for (i = 0; i < data.length; i++) {
      const {
        id,
        title,
        price,
        description,
        category,
        image,
        sold,
        dateOfSale,
      } = data[i];
      const qury = `INSERT INTO products (id, title, price, description, category, image, sold, dateOfSale) 
      VALUES (${id}, ${title}, ${price}, ${description}, ${category}, ${image}, ${sold}, ${dateOfSale});
      `;
      db.run(qury, function (err) {
        if (err) {
          console.error('Error inserting data:', err.message);
        } else {
          console.log(`Row inserted with rowid ${this.lastID}`);
        }
      });
    }
  })
  .catch((error) => console.log(error));

module.exports = db;
