const QRCode = require('qrcode');
const User =  require('../models/user');
const createNewUser  = async  (req, res) => {
           
  //1. Obtener informacion del usuario
  const { name, email,profileImage } = req.body.user;
  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required' });
  }  
  //2. Asignar el role de administrador en caso de que aplique 
  var {role} = req.body.user;
  console.log("ROLE"+role);
  console.log("req.body.user"+req.body.user);
  const adminEmailsString = process.env.ADMIN_EMAILS;
  const adminEmailsArray = adminEmailsString ? adminEmailsString.split(',') : [];
        
  if(adminEmailsArray.includes(email)){
    role = "admin";
    try{
      await User.create({ name, email,profileImage,role});
      res.status(201).json({ message: 'Admin User Registered' });
    } catch (error) {
      console.error('Error registering admin user:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    } 
   }

  //3.Obtener el estudiante ID del email del usuario
  const correoInstitucional = /^(\d{2}-\d{5})@usb\.ve$/;
  var estudianteID;
  if(correoInstitucional.test(email)){
    const numeroCarnet = correoInstitucional.exec(email);
    if (numeroCarnet && numeroCarnet[1]) {
      estudianteID = numeroCarnet[1].replace('-', '');;
    }
    else{
      return res.status(400).json({ message: 'Correo institucional de estudiante no valido' });
    }     
  }

  //4. Guardar el usuario en la base de datos
  try{
    await User.create({ name, email,profileImage,role,estudianteID});
    res.status(201).json({ message: 'User Registered' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }   
}

const getUsers = async (req, res) => {
  //1. Agregar paginacion
  var page=0;
  var limit=0;
  if(req.query.page){
    page = req.query.page;
  }

  if(req.query.limit){
    limit = req.query.limit;
  }

  var offset = page*limit;
  
  
  
  //2. Agregar filtros según los queries
  
  const filtros = {};
  if(req.query.estudianteID)
    {
    filtros.estudianteID = req.query.estudianteID;
    }

  if(req.query.becado)
    {
      filtros.becado = req.query.becado;
    }
    
  //3.Consultar en la base de datos
   try 
  {   
    const users = await User.find(filtros).skip(offset).limit(limit);
    res.status(200).json(users);
  } 
  catch (error) 
  {
    res.status(500).json({ message: error.message });
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
    generateQR,
    getUsers
}