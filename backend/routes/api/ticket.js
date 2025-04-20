const express = require('express');
const router = express.Router();
const ticketController = require('../../controller/ticketController');



router.route('/')
    .get(ticketController.getAllTickets)
    .post(ticketController.createTicket);  


router.post('/consume-ticket', ticketController.consumeTicket);

module.exports = router;

