const { response } = require('express');
const db = require('../database/database');
require('dotenv').config();

const data = fetch(process.env.PRIMARY_DATA)
  .then((response) => {
    // Check if the response is successful
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    // Parse the JSON response
    return response.json();
  })
  .then((data) => {
    // Do something with the fetched data
    console.log(data);
  })
  .catch((error) => {
    // Handle any errors that occurred during the fetch
    console.error('Fetch error:', error);
  });

  console.log(response)

module.exports = data;

console.log(data);
