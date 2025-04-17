// server.js (Node.js with Express)

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();
const QRCode = require('qrcode');
const app = express();
const port = 5500; // Choose your desired port

// Middleware to parse JSON bodies
app.use(bodyParser.json());

const cors = require("cors")
/*app.use(
  cors({
    origin: "http://localhost:3000",
  })
)*/

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
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define User Schema (same as your Next.js project)
const userSchema = new mongoose.Schema({
  name: String,
  email: String  
});

const User = mongoose.model('User', userSchema);

// POST route for user registration
app.post('/api/user', async (req, res) => {
  try {
    const { name, email } = req.body;

    //Generated QR code
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    await User.create({ name, email });
    res.status(201).json({ message: 'User Registered' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/api/image', async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).send('Email parameter is required');
  }

  try {
    const qrCodeDataURL = await QRCode.toDataURL(email);

    // Convert Data URL to Buffer to send as image
    const base64Data = qrCodeDataURL.replace(/^data:image\/png;base64,/, "");
    const imageBuffer = Buffer.from(base64Data, 'base64');
    console.log('QR generared!');
    console.log(email);
    res.setHeader('Content-Type', 'image/png');
    res.send(imageBuffer);

  } catch (error) {
    console.error('Error generating QR code:', error);
    res.status(500).send('Error generating QR code');
  }
});

app.get('/api/data', async (req, res) => {
  const { email } = req.query;
  console.log(`email=${email}`);

  if (!email) {
    return res.status(400).send('Email parameter is required');
  }
  QRCode.toDataURL(`QR=${email}`).then(console.log)
  QRCode.toDataURL(email, (err, qrCodeString) => {
    if (err) {
      res.status(500).json({ error: 'Failed to generate QR code' });
    } else {
      console.log(qrCodeString) 
      res.status(200).json({ qrCode: qrCodeString }); 
    }
  });
  
  //res.status(200).send(email);

  
});





app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});