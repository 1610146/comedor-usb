const {Ticket,TicketStatusEnum} =  require('../models/ticket');
const { v4: uuidv4 } = require('uuid');





const createTicket = async (req, res) => {
    const newTicket = new Ticket({
      ticketID: uuidv4(),
      ticketType: req.body.ticketType,
      precioTicket: req.body.precioTicket,
      fechaEmision: req.body.fechaEmision,
      fechaUso: req.body.fechaUso,
      ticketStatus: req.body.ticketStatus,
      estudianteID: req.body.estudianteID,
    });
  
    try {
      const savedTicket = await newTicket.save();
      res.status(201).json(savedTicket);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

// GET all tickets
const getAllTickets = async (req, res) => {
    try {
      const tickets = await Ticket.find();
      res.status(200).json(tickets);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  

const consumeTicket = async (req, res) => {
    const { estudianteID, ticketType } = req.body;
  
    //1. Validaciones
    if (!estudianteID || !ticketType) {
      return res.status(400).json({ message: 'Se requiere estudianteID y ticketType.' });
    }

    //2. Buscar  si existen tickets disponibles
  
    try {
      const ticketsDisponibles = await Ticket.find({
        estudianteID: estudianteID,
        ticketType: ticketType,
        Status: "Disponible", 
      }).sort({ fechaEmision: 1 });
      console.log(ticketsDisponibles);
      //3. Actializar status del Ticket
  
      if (ticketsDisponibles && ticketsDisponibles.length > 0) {
        const ticketMasAntiguo = ticketsDisponibles[0];
        ticketMasAntiguo.Status = "Usado"; 
        ticketMasAntiguo.fechaUso = new Date();
        await ticketMasAntiguo.save();
        return res.status(200).json({ message: 'Entrada registrada y ticket más antiguo utilizado.', ticket: ticketMasAntiguo });
      } else {
        return res.status(404).json({ message: 'No se encontró ningún ticket disponible para este estudiante y tipo.' });
      }
    } catch (error) {
      console.error('Error al registrar la entrada al comedor:', error);
      return res.status(500).json({ message: 'Error al procesar la entrada al comedor.' });
    }
  }

  module.exports = {
    consumeTicket,
    createTicket,
    getAllTickets
  }
   