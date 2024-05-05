const express = require('express');
require('dotenv').config();
const app = express();

const db = require('../database/database');

// const data = require('../database/dataFetch');

// console.log(data, 'server data')

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`server started at port ${port}`);
});
