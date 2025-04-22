const QRCode = require('qrcode');
const User =  require('../models/user');
const createNewUser  = async  (req, res) => {
    try {
        const { name, email } = req.body.user;
        console.log(email);    
        
        if (!name || !email) {
          return res.status(400).json({ message: 'Name and email are required' });
        }
    
        await User.create({ name, email });
        res.status(201).json({ message: 'User Registered' });
      } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
}

const generateQR  = async (req, res) => {
    const { email } = req.query;
    
  
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
    
  }
  

module.exports = {
    createNewUser,
    generateQR
}