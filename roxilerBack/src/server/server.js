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

  // console.log(search);

  if (search == '**') {
    query = `select * from products limit 10 offset ${offset}`;
  } else {
    query = `SELECT * FROM products WHERE title LIKE '%${search}%' OR description LIKE '%${search}%' OR price LIKE '%${search}%' 
  limit 10 offset ${offset};`;
  }

  // console.log(query);

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
      // console.log(query);
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
        // console.log(rows[0].item_count);
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
  const { month } = req.params;
  const query = `SELECT category, count(id) AS items FROM products WHERE substr(dateOfSale, 6, 2) = '${month}' GROUP by category`;
  db.all(query, (err, rows) => {
    if (err) {
      res.status(500).json({ message: 'contact me on github @noobwebdev777' });
    } else {
      console.log(rows);
      res.status(200).json({ itemscount: rows });
    }
  });
});

//total items in a given price range
app.get('/barchart/data/:month', (req, res) => {
  console.log('api5')
  const { month } = req.params;
  const query = `SELECT
  CASE
      WHEN price BETWEEN 0 AND 100 THEN '0-100'
      WHEN price BETWEEN 101 AND 200 THEN '101-200'
      WHEN price BETWEEN 201 AND 300 THEN '201-300'
      WHEN price BETWEEN 301 AND 400 THEN '301-400'
      WHEN price BETWEEN 401 AND 500 THEN '401-500'
      WHEN price BETWEEN 501 AND 600 THEN '501-600'
      WHEN price BETWEEN 601 AND 700 THEN '601-700'
      WHEN price BETWEEN 701 AND 800 THEN '701-800'
      WHEN price BETWEEN 801 AND 900 THEN '801-900'
      ELSE '900-above'
  END AS price_range,
  COUNT(*) AS item_count
FROM
  products
WHERE substr(dateOfSale, 6, 2) = '${month}'
GROUP BY
  CASE
      WHEN price BETWEEN 0 AND 100 THEN '0-100'
      WHEN price BETWEEN 101 AND 200 THEN '101-200'
      WHEN price BETWEEN 201 AND 300 THEN '201-300'
      WHEN price BETWEEN 301 AND 400 THEN '301-400'
      WHEN price BETWEEN 401 AND 500 THEN '401-500'
      WHEN price BETWEEN 501 AND 600 THEN '501-600'
      WHEN price BETWEEN 601 AND 700 THEN '601-700'
      WHEN price BETWEEN 701 AND 800 THEN '701-800'
      WHEN price BETWEEN 801 AND 900 THEN '801-900'
      ELSE '900-above'
  END
ORDER BY
  price_range;
`;
  db.all(query, (err, rows) => {
    if (err) {
      res.status(500).json({ message: 'contact me on github @noobwebdev777' });
    } else {
      res.status(200).json({ data: rows });
    }
  });
});


//------------------------server_lol_________________________

let server;

const shutdownServer = () => {
  server.close(() => {
    console.log(`server is shutting down port:${port} is free`);
  });
};

//server shutdown
app.get('/server/shutdown', (req, res) => {
  res.status(200).json({ message: 'server is shutting down' });
  shutdownServer();
});

const startServer = () => {
  server = app.listen(port, () => {
    console.log(`server started at port ${port}`);
  });
};

//server restart
app.get('/server/restart', (req, res) => {
  shutdownServer();
  startServer();
  res.send('Server is restarting...');
});

// //server shutdown message
// server.on('close', () => {
//   console.log(`server is shutting down port:${port} is free`);
// });

startServer();
