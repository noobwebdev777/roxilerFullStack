// database.js
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('products.db');

require('dotenv').config();

const fetch = require('node-fetch');

const json = require('../../product_transaction.json');

const url = process.env.PRIMARY_DATA;

db.run(
  `CREATE TABLE IF NOT EXISTS products (
id INTEGER,
title TEXT ,
price DECIMAL(10, 2),
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

db.all(`SELECT COUNT(*) AS total_rows FROM products;`, (err, rows) => {
  if (err) {
    console.error('Error executing query:', err.message);
  } else {
    const totalRows = rows[0].total_rows;
    if (totalRows === 0) {
      // Create a table

      const fetchData = fetch(url)
        .then((response) => {
          console.log(response.ok);
          if (!response.ok) {
            throw new Error('Failed to fetch data');
          }
          return response.json();
        })
        .then((data) => {
          function convertToSingleQuotes(str) {
            return str.replace(/"/g, "'");
          }
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

            // Function to properly format strings for SQL queries (escaping single quotes)
            function convertToSingleQuotes(str) {
              return str.replace(/'/g, "''");
            }

            let stringWithSingleQuotes = convertToSingleQuotes(title);

            console.log(stringWithSingleQuotes);

            let cat = convertToSingleQuotes(category);

            const query = `INSERT INTO products (id, title, price, description, category, image, sold, dateOfSale)
                     VALUES (${id}, '${stringWithSingleQuotes}', ${price}, '${description}', '${cat}', '${image}', ${sold}, '${dateOfSale}');
                   `;

            db.run(query, function (err) {
              if (err) {
                console.error('Error inserting data:', err.message);
              } else {
                console.log(`Row inserted with rowid ${this.lastID}`);
              }
            });
          }
        })
        .catch((error) => console.log(error));
    } else {
      console.log('product_db have data, no need to fetch data');
    }
  }
});

module.exports = db;
