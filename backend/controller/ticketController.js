const {Ticket,TicketStatusEnum} =  require('../models/ticket');
const { v4: uuidv4 } = require('uuid');





const createTicket = async (req, res) => {
    const newTicket = new Ticket({
      ticketID: uuidv4(),      
      precioTicket: req.body.precioTicket,
      fechaEmision: req.body.fechaEmision,
      fechaUso: req.body.fechaUso,
      ticketStatus: req.body.ticketStatus,
      estudianteID: req.body.estudianteID,
      Status: req.body.Status
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
    //1. Agregar paginacion
    var page=0;
    var limit=0;
    
  
    if(req.query.limit){
      limit = parseInt(req.query.limit);

      if(req.query.page){
        page =  parseInt(req.query.page -1);
      }
    }
  
    var offset = (page*limit);

  //2. Agregar filtros según los queries
  
  const filtros = {};

  if (req.query.fechaInicio && !req.query.fechaFin ) {
    filtros.fechaUso = {
      
      $gte: new Date(req.query.fechaInicio),
    };
  }

  
  if (req.query.fechaFin && !req.query.fechaInicio) {
    filtros.fechaUso = {     
      $lte: new Date(req.query.fechaFin),
    };
  }

  if(req.query.fechaInicio && req.query.fechaFin){
    filtros.fechaUso = {     
      $gte: new Date(req.query.fechaInicio),
      $lte: new Date(req.query.fechaFin),
    };

  }

  if(req.query.estudianteID){
    filtros.estudianteID = req.query.estudianteID;
  }

  
  
  if (req.query.Status) {
    const statusValues = Object.values(TicketStatusEnum);
    if (statusValues.includes(req.query.Status)) {
      filtros.Status = req.query.Status;
    }
  }
  //3.Consultar en la base de datos  
  try {
    const totalTickets = await Ticket.countDocuments(filtros);
    const tickets = await Ticket.find(filtros).skip(offset).limit(limit); 
    const hasMore=(offset + limit) > totalTickets;
    
    
    res.status(200).json({
      data: tickets,
      meta: {
        totalTickets:totalTickets,
        limit: limit,
        offset: offset,
        hasMore: hasMore
      }
  });

    
   
      
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  

const consumeTicket = async (req, res) => {
    const { estudianteID, ticketType } = req.body;
  
    //1. Validaciones
    if (!estudianteID ) {
      return res.status(400).json({ message: 'Se requiere estudianteID.' });
    }

    //2. Buscar  si existen tickets disponibles
  
    try {
      const ticketsDisponibles = await Ticket.find({
        estudianteID: estudianteID,       
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
        return res.status(404).json({ message: 'No se encontró ningún ticket disponible para este estudiante.' });
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
   