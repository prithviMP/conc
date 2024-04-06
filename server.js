const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
require('dotenv').config("./.env");
const request = require('request');
const axios = require('axios')
const Razorpay = require('razorpay');
const zohoRoutes = require('./routes/zohoRoutes');
const razorpayRoutes = require('./routes/razorPayRoutes');
const passport = require('./config/passportConfig');




console.log("zoho client id ",process.env.ZOHO_CLIENT_ID);

const app = express();
app.use(bodyParser.json());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(session({ /* session config */ })); // If using sessions
app.use(passport.initialize());
//app.use(passport.session()); // If using sessions

app.use('/zoho', zohoRoutes);
app.use('/razorpay', razorpayRoutes);

var instance = new Razorpay({
  key_id: 'rzp_test_0eGcmNDRrunO2e',
  key_secret: '6rUZhBeNhV0bJ3S09cTbrs0N',
});

const db = new sqlite3.Database(':memory:');
db.run("CREATE TABLE users (id TEXT PRIMARY KEY, name TEXT, email TEXT)");

app.post('/create-order', (req, res) => {
  let options = {
    amount: 499, // Smallest currency unit
    currency: "INR",
    receipt: "order_rcptid_11"
  };

  instance.orders.create(options, (err, order) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.send(order);
  });
});

app.post('/razorpay-webhook', (req, res) => {
    const payment = req.body;
    const { id, name, email } = payment; // Extract relevant data based on Razorpay's payload structure

    console.log("hello webhook");
    // Store in SQLite Database
    db.run(`INSERT INTO users (id, name, email) VALUES (?, ?, ?)`, [id, name, email], (err) => {
        if (err) return console.error(err.message);

        // Call Zoho CRM API to store user information
        const options = {
            method: 'POST',
            url: 'https://www.zohoapis.com/crm/v2/Leads',
            headers: {
                Authorization: 'Zoho-oauthtoken YOUR_ZOHO_ACCESS_TOKEN'
            },
            body: JSON.stringify({
                data: [{
                    Last_Name: name, // Assuming 'name' represents the last name
                    Email: email,
                    Lead_Source: 'Website'
                }]
            })
        };

        request(options, (error, response) => {
            if (error) throw new Error(error);
            console.log(response.body);
        });
    });

    res.status(200).send('Webhook received and processed');
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
