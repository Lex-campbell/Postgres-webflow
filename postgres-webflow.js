require('dotenv').config();
const express = require('express');
const axios = require('axios');
const { Client } = require('pg');

const app = express();

const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

client.connect();

let processedRows = [];

app.post('/submitData', async (req, res) => {
  const query = 'SELECT id, amount, cost, retail, peer1, peer2 FROM table.name';
  const result = await client.query(query);

  const headers = {
    'Authorization': process.env.WEBFLOW_AUTH,
    'Content-Type': 'application/json'
  };

  const existingData = await axios.get(process.env.WEBFLOW_API_URL, { headers });

  // Check for items that no longer exist in Postgres and delete them from Webflow
  existingData.data.items.forEach(async item => {
    const itemId = item.slug.split("-")[1];
    if (!result.rows.find(row => row.id === itemId)) {
      const response = await axios.delete(`${process.env.WEBFLOW_API_URL}/${item._id}`, { headers });

      console.log(response.status, "Deleted Item:", `${item._id}`);
    }
  });

  // Iterate over the Postgres rows
  result.rows.forEach(async row => {
    if (!processedRows.includes(row.id)) {
      // If an item hasn't been processed store the data for the current row
      const data = {
        id: row.id,
        amount: row.amount,
        cost: row.cost,
        retail: row.retail,
        peer1: row.peer1,
        peer2: row.peer2
      };

      // Check if the item exists in Webflow
      const itemExists = existingData.data.items.find(item => item.slug === `order-${data.id}`);
      
      // If the item does not exist in Webflow
      if (!itemExists) {
        // Add the item to the processed array
        processedRows.push(row.id);
        // Create the payload for the new item
        const payload = {
          fields: {
            slug: `order-${data.id}`,
            name: `order-${data.id}`,
            _archived: false,
            _draft: false,
            amount: data.amount,
            cost: data.cost,
            retail: data.retail,
            peer1: data.peer1,
            peer2: data.peer2
          }
        };

        // Create the new item in Webflow
        const response = await axios.post(process.env.WEBFLOW_API_URL, payload, { headers });

        console.log(response.status, "Added Item:",`${data.id}`);
      } else {
        // If the item does exist in Webflow
        processedRows.push(row.id);

        const payload = {
          fields: {
            slug: `order-${row.id}`,
            name: `order-${row.id}`,
            _archived: false,
            _draft: false,
            amount: data.amount,
            cost: data.cost,
            retail: data.retail,
            peer1: data.peer1,
            peer2: data.peer2
          }
        };

        // Update the item in Webflow
        const response = await axios.put(`${process.env.WEBFLOW_API_URL}/${itemExists._id}`, payload, { headers });

        console.log(response.status, "Updated Item:",`${row.id}`);
      }
    }
  });
  res.header("Access-Control-Allow-Origin", "*");
  res.sendStatus(200);
});

app.listen(process.env.APP_PORT, () => {
  console.log(`Server running at http://localhost:${process.env.APP_PORT}`);
});
