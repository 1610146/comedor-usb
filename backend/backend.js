// server.js (Node.js with Express)

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();
const QRCode = require('qrcode');
const app = express();
const port = 5500; // Choose your desired port
const users = require('./routes/api/user');
const tickets = require('./routes/api/ticket');
const connectDB = require('./models/db');

// Middleware to parse JSON bodies
app.use(bodyParser.json());
express.json()

const cors = require("cors")

const allowedOrigins = [
  'http://localhost:3000', // Your Next.js frontend
  'http://localhost:3001',    // Another allowed origin
  'https://another-app.net' // Yet another allowed origin
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

// MongoDB Connection
connectDB();

//Routes

app.use('/api/user',users);
app.use('/api/ticket',tickets);
//Server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});