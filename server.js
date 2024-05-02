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
const db = require('./config/database'); // Adjust the path based on your structure
const User = require('./models/userModel'); // Adjust the path based on your structure
const userService = require('./services/userService'); // Make sure the path is correct
const strapiService = require('./services/strapiService');
const commentsRoutes = require('./routes/commentsRoutes');
const  likeRoutes  = require('./routes/likeRoutes');








console.log("zoho client id ",process.env.ZOHO_CLIENT_ID);

const app = express();
app.use(cors());
app.use(bodyParser.json());
const routeList = require("express-routes-catalogue").default;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(session({ /* session config */ })); // If using sessions
app.use(passport.initialize());
//app.use(passport.session()); // If using sessions

app.use('/zoho', zohoRoutes);
app.use('/razorpay', razorpayRoutes);
app.use('/files', fileRoutes);
app.use(commentsRoutes)
app.use(likeRoutes)


console.log(routeList);
routeList.terminal(app);


var instance = new Razorpay({
  key_id: 'rzp_test_0eGcmNDRrunO2e',
  key_secret: '6rUZhBeNhV0bJ3S09cTbrs0N',
});


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
  const paymentInfo = payment.payload.payment.entity;
  const payerEmail = paymentInfo.email;
  const payerName = paymentInfo.name; // Make sure this is the correct path to the name in the payload
  const payerContact = paymentInfo.contact;
  const payerCity = paymentInfo.city;


  try {
    // Check if the payment event is successful and if so, update the user's status
    if (payment.event === 'payment.success') { // Adjust the event type based on Razorpay's actual payload
      // Find or create the user
      let user = await userService.findOrCreateUser({
        name: payerName,
        email: payerEmail,
        phone: payerContact,
        city: payerCity, 
      });

      // Update the user's status to 'Paid' regardless if they were just created or already existed
      updateLeadStatus(payerEmail, "Paid");
      user = await userService.updateUserStatus(user.email, 'paid_customer');

      res.status(200).send('Webhook received and processed');
    } else {
      // If the payment event is not successful, you may want to handle it differently
      console.log(`Received payment event: ${payment.event}, but not handling it.`);
      res.status(200).send(`Received payment event: ${payment.event}, but not handling it.`);
    }
  } catch (error) {
    // Handle errors from userService or any other errors
    console.error('Error processing Razorpay webhook:', error);
    await userService.logAnomaly(error); // Make sure this method is defined to handle the logging
    res.status(500).send('An error occurred while processing the webhook');
  }
});


//  app.post('/razorpay-webhook', async (req, res) => {
//     const payment = req.body;
//     const { id, name, email } = payment; // Extract relevant data based on Razorpay's payload structure
//     const paymentInfo = payment.payload.payment.entity;
//     const payerEmail = paymentInfo.email;
//     const payerContact = paymentInfo.contact;

//     console.log("hello email pf payer", payerEmail);
//     // Store in SQLite Database
//     // db.run(`INSERT INTO users (id, name, email) VALUES (?, ?, ?)`, [id, name, email], (err) => {
//     //     if (err) return console.error(err.message);
      
  
//     // });

  
//    // console.log(data);
//     // Insert code to save leadData in your database here
//       updateLeadStatus(payerEmail, "Paid");
//     //res.status(200).send('Webhook received and processed');
// });

app.get('/get-lead', async (req, res) => {
  const payment = req.body;
  

  //.log("hello email pf payer", payerEmail);
  
   return res.send({"status" : await getLeadStatus("prithv44hhh@gmail.com")});
 
});

async function getLeadStatus(email) {
  try {
      const searchResponse = await axiosZoho.get(`/crm/v6/Leads/search?email=${email}`);

      console.log(searchResponse+"<---------------");
      if (searchResponse.data && searchResponse.data.data.length > 0) {
          const lead = searchResponse.data.data[0];
          console.log(lead);
          if (typeof lead.Lead_Status === "undefined") {
            return false;
        
          }else if(lead.Lead_Status == "Paid"){
            return true;
          }
          
      } else {
          console.log('No lead found with the given email');
          return false;
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




// Fetch all posts
app.get('/posts', async (req, res) => {
  try {
      const posts = await strapiService.fetchAllPosts();
      res.json(posts);
  } catch (error) {
    console.log(error);
      res.status(500).send('Failed to fetch posts');
  }
});

// Fetch a single post
app.get('/posts/:id', async (req, res) => {
  try {
      const post = await strapiService.fetchPostById(req.params.id);
      res.json(post);
  } catch (error) {
      res.status(500).send('Failed to fetch post');
  }
});

// Fetch all announcements
app.get('/announcements', async (req, res) => {
  try {
      const announcements = await strapiService.fetchAllAnnouncements();
      res.json(announcements);
  } catch (error) {
      res.status(500).send('Failed to fetch announcements');
  }
});

// Fetch a single announcement
app.get('/announcements/:id', async (req, res) => {
  try {
      const announcement = await strapiService.fetchAnnouncementById(req.params.id);
      res.json(announcement);
  } catch (error) {
      res.status(500).send('Failed to fetch announcement');
  }
});

// Fetch all polls
app.get('/polls', async (req, res) => {
  try {
      const polls = await strapiService.fetchAllPolls();
      res.json(polls);
  } catch (error) {
      res.status(500).send('Failed to fetch polls');
  }
});

// Fetch a single poll
app.get('/polls/:id', async (req, res) => {
  try {
      const poll = await strapiService.fetchPollById(req.params.id);
      res.json(poll);
  } catch (error) {
      res.status(500).send('Failed to fetch poll');
  }
});
// Fetch all important links
app.get('/important-links', async (req, res) => {
  try {
      const importantLinks = await strapiService.fetchAllImportantLinks();
      res.json(importantLinks);
  } catch (error) {
      res.status(500).send('Failed to fetch important links');
  }
});

// Fetch a single important link
app.get('/important-links/:id', async (req, res) => {
  try {
      const importantLink = await strapiService.fetchImportantLinkById(req.params.id);
      res.json(importantLink);
  } catch (error) {
      res.status(500).send('Failed to fetch important link');
  }
});

// Fetch all categories
app.get('/categories', async (req, res) => {
  try {
      const categories = await strapiService.fetchAllCategories();
      res.json(categories);
  } catch (error) {
      res.status(500).send('Failed to fetch categories');
  }
});

// Fetch a single category
app.get('/categories/:id', async (req, res) => {
  try {
      const category = await strapiService.fetchItemById('categories', req.params.id); // Assuming `fetchItemById` is flexible for any type
      res.json(category);
  } catch (error) {
      res.status(500).send('Failed to fetch category');
  }
});




const PORT = process.env.PORT || 8000;


db.sequelize.sync({ force: false }) // Use { force: true } only if you want to drop and re-create tables
  .then(() => {
    console.log('Database synced');
    app.listen(PORT, () => console.log('Server running on http://localhost:'+PORT));
  })
  .catch(err => console.error('Failed to sync database:', err));