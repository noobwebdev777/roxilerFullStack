const express = require('express');
require('dotenv').config();
const app = express();

const db = require('../database/database');

app.use(express.json());

const port = process.env.PORT || 5000;

//search and pagination params api
app.get('/transactiontable', (req, res) => {
  const { search, offset } = req.query;
  let query = ``;

  console.log(search);

  if (search == '**') {
    query = `select * from products limit 10 offset ${offset}`;
  } else {
    query = `SELECT * FROM products WHERE title LIKE '%${search}%' OR description LIKE '%${search}%' OR price LIKE '%${search}%' 
  limit 10 offset ${offset};`;
  }

  console.log(query);

  db.all(query, (err, rows) => {
    if (err) {
      res.status(500).json({ message: err });
    } else {
      res.status(200).json(rows);
    }
  });
});

//statistics and sales data api
app.get('/statistics/:month', (req, res) => {
  const month = req.params.month;
  const query = `select sum(price) as total_amount, count(id) as total_sale from products where substr(dateOfSale, 6, 2) = '${month}' group by sold;`;
  db.all(query, (err, rows) => {
    if (err) {
      res.status(500).json({ message: 'contact me on github @noobwebdev777' });
    } else {
      console.log(query);
      console.log(rows.length);
      if (rows.length === 1) {
        const saleAmount = rows[0].total_amount;
        const saleCount = rows[0].total_sale;
        const data = {
          saleamount: saleAmount,
          salecount: saleCount,
          unSoldCount: 0,
        };
        res.status(200).json(data);
      } else {
        console.log(rows[0], rows[1]);
        const saleAmount = rows[0].total_amount;
        const saleCount = rows[0].total_sale;
        const unSaleCount = rows[1].total_sale;
        const data = {
          saleamount: saleAmount,
          salecount: saleCount,
          unSoldCount: unSaleCount,
        };
        res.status(200).json(data);
      }
    }
  });
});

//items count for bar chart with price
app.get('/barchart/price', (req, res) => {
  const { from, to } = req.query;
  if (to == undefined) {
    const query = `SELECT count(id) as item_count FROM products WHERE price > ${from}`;
    db.all(query, (err, rows) => {
      if (err) {
        res
          .status(500)
          .json({ message: 'contact me on github @noobwebdev777' });
      } else {
        console.log(rows[0].item_count);
        res.status(200).json({
          pricefrom: from,
          itemCount: rows[0].item_count,
        });
      }
    });
  } else {
    const query = `SELECT count(id) as item_count FROM products WHERE price BETWEEN ${from} AND ${to}`;
    db.all(query, (err, rows) => {
      if (err) {
        res
          .status(500)
          .json({ message: 'contact me on github @noobwebdev777' });
      } else {
        console.log(rows[0].item_count);
        res.status(200).json({
          pricefrom: from,
          priceto: to,
          itemCount: rows[0].item_count,
        });
      }
    });
  }
});


//items count for bar chart
app.get('/barchart/itemscount/:month', (req, res) => {
  const {month} = req.params
  const query = `SELECT count(id) FROM products WHERE substr(dateOfSale, 6, 2) = '${month}' GROUP by category`
  
});

app.listen(port, () => {
  console.log(`server started at port ${port}`);
});
