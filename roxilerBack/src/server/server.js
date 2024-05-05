const express = require('express');
require('dotenv').config();
const app = express();

const db = require('../database/database');

app.use(express.json())

// const data = require('../database/dataFetch');

// console.log(data, 'server data')

const port = process.env.PORT || 5000;

app.get('/' , (req, res) => {

})

app.get('/' , (req, res) => {
  
})

app.get('/' , (req, res) => {
  
})

app.get('/' , (req, res) => {
  
})


app.listen(port, () => {
  console.log(`server started at port ${port}`);
});
