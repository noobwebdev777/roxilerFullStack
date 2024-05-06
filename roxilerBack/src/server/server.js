const express = require("express");
require("dotenv").config();
const app = express();

const db = require("../database/database");

app.use(express.json());

const port = process.env.PORT || 5000;

//search and pegnation params api
app.get("/transactiontable", (req, res) => {
  const {search, offset} = req.query
  let query = ``

  console.log(search)

  if (search == '**'){
    query = `select * from products limit 10 offset ${offset}`
  }else{
    query = `SELECT * FROM products WHERE title LIKE '%${search}%' OR description LIKE '%${search}%' OR price LIKE '%${search}%' 
  limit 10 offset ${offset};`
  }

  console.log(query)

  db.all(query, (err, rows) => {
    if(err){
      res.status(500).json({message: err})
    }else{
      res.status(200).json(rows)
    }
  })

  // res.status(200).json({message: 'got the request lmao'})
});

//statistics and sales data api
app.get("/statistics/:month", (req, res) => {
  const month = req.params.month
  const query = `select sum(price) as total_sale, count(id) as total_sale from products where substr(dateOfSale, 6, 2) = ${month} group by sold;`
  db.run(query, (err, rows) => {
    if(err){
      res.status(500).json({message: 'contact me on github @noobwebdev777'})
    }else{
      console.log(rows)
    }
  })
});

app.get("/", (req, res) => {});

app.get("/", (req, res) => {});

app.listen(port, () => {
  console.log(`server started at port ${port}`);
});
