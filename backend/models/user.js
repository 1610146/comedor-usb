const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  
  
  name: {
    type: String,
    required: true,    
    description: 'Nombre del Usuario'
  },
  email: {
    type: String,
    required: true,
    unique:true, 
    description: 'Correo del Usuario'
  },
  profileImage: {
    type: String,    
    description: 'Foto de perfil'
  },  
  role: {
    type: String,        
    description: 'Role del Usuario'
  },
  qrCode: {
    type: String,       
    description: 'Codigo QR en base64 para la identificacion del usuario '
  },
  becado: {
    type: Boolean,
    default: false,       
    description: 'True: El estudiante es becado ; False: El estudiante no es becado'
  },
  estudianteID: {
    type: String,        
    description: 'Codigo QR en base64 para la identificacion del usuario '
  }  
});
module.exports = mongoose.model('User', userSchema);
