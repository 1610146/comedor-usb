const mongoose = require('mongoose');

const TicketStatusEnum = {
  Disponible: 'Disponible',
  Usado: 'Usado',
  Anulado: 'Anulado', // Puedes agregar más estados si es necesario
};

const ticketSchema = new mongoose.Schema({
  ticketID: {
    type: String,
    required: true,
    unique: true,
    description: 'Identificador único del ticket dentro del sistema'
  },
  ticketType: {
    type: String,
    enum: ["Desayuno", "Almuerzo", "Cena"],
    description: 'Tipo de servicio que el ticket representa'
  },
  precioTicket: {
    type: Number,
    description: 'Precio en moneda local del ticket'
  },
  fechaEmision: {
    type: Date,
    description: 'Fecha en la cual el ticket fue emitido'
  },
  fechaUso: {
    type: Date,
    default: null,
    description: 'Fecha en la cual el ticket fue consumido'
  },
  Status: {
    type: String,
    enum: Object.values(TicketStatusEnum), // Usa los valores del enum para la validación
    default: TicketStatusEnum.Disponible, // Establece un valor por defecto si es necesario
  },
  estudianteID: {
    type: String,
    description: 'Identificador del estudiante a quien el ticket pertenece'
  }
});

//module.exports = mongoose.model('Ticket', ticketSchema);
const Ticket = mongoose.model('Ticket', ticketSchema);
module.exports = {
  Ticket,
  TicketStatusEnum
}



