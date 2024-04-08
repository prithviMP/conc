const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
require('dotenv').config("./.env");
const request = require('request');
const axios = require('axios')
const Razorpay = require('razorpay');
const zohoRoutes = require('./routes/zohoRoutes');
const razorpayRoutes = require('./routes/razorPayRoutes');
const fileRoutes = require('./routes/fileRoutes'); 
const passport = require('./config/passportConfig');
const path = require('path');
const cors = require('cors');
const axiosZoho = require('./config/axiosZoho');





console.log("zoho client id ",process.env.ZOHO_CLIENT_ID);

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(session({ /* session config */ })); // If using sessions
app.use(passport.initialize());
//app.use(passport.session()); // If using sessions

app.use('/zoho', zohoRoutes);
app.use('/razorpay', razorpayRoutes);
app.use('/files', fileRoutes);


var instance = new Razorpay({
  key_id: 'rzp_test_0eGcmNDRrunO2e',
  key_secret: '6rUZhBeNhV0bJ3S09cTbrs0N',
});

const db = new sqlite3.Database(':memory:');
db.run("CREATE TABLE users (id TEXT PRIMARY KEY, name TEXT, email TEXT)");

app.get('/.well-known/pki-validation/', (req, res) => {
  const filePath = path.join(__dirname, 'ED55C88A82D243CE35CEB8A22E71E88E.txt'); // Adjust the path and file name as necessary
  res.sendFile(filePath, err => {
    if (err) {
      // Handle error, but ensure header is not already sent
      if (!res.headersSent) {
        res.status(500).send('Error sending file');
      }
    }
  });
});

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

 app.post('/razorpay-webhook', async (req, res) => {
    const payment = req.body;
    const { id, name, email } = payment; // Extract relevant data based on Razorpay's payload structure
    const paymentInfo = payment.payload.payment.entity;
    const payerEmail = paymentInfo.email;
    const payerContact = paymentInfo.contact;

    console.log("hello email pf payer", payerEmail);
    // Store in SQLite Database
    // db.run(`INSERT INTO users (id, name, email) VALUES (?, ?, ?)`, [id, name, email], (err) => {
    //     if (err) return console.error(err.message);
      
  
    // });

  
   // console.log(data);
    // Insert code to save leadData in your database here
      updateLeadStatus(payerEmail, "Paid");
    //res.status(200).send('Webhook received and processed');
});

app.get('/get-lead', async (req, res) => {
  const payment = req.body;
  

  //.log("hello email pf payer", payerEmail);
  
   return res.send({"status" : await getLeadStatus("prithvihhh@gmail.com")});
 
});

async function getLeadStatus(email) {
  try {
      const searchResponse = await axiosZoho.get(`/crm/v6/Leads/search?email=${email}`);

      console.log(searchResponse+"<---------------");
      if (searchResponse.data.data.length > 0) {
          const lead = searchResponse.data.data[0];
          console.log(lead);
          if (typeof lead.Lead_Status === "undefined") {
            return false;
        
          }else if(lead.Lead_Status == "Paid"){
            return true;
          }
          
      } else {
          console.log('No lead found with the given email');
      }
  } catch (error) {
      
      console.error('Error updating lead status:',error);
  }
}

async function updateLeadStatus(email,newStatus) {
  try {
      const searchResponse = await axiosZoho.get(`/crm/v6/Leads/search?email=${email}`);

      console.log(searchResponse+"<---------------");
      if (searchResponse.data.data.length > 0) {
        console.log();
          const leadId = searchResponse.data.data[0].id;
          console.log(leadId);
          const updateResponse = await axiosZoho.put('/crm/v6/Leads', {
              data: [{ id: leadId, Lead_Status: newStatus }]
          });

          console.log('Lead status updated:', updateResponse.data);
      } else {
          console.log('No lead found with the given email');
      }
  } catch (error) {
      
      console.error('Error updating lead status:',error);
  }
}
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
