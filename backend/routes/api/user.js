const express = require('express');
const router = express.Router();
const userController = require('../../controller/userController');


router.route('/')
    .get(userController.getUsers)
    .post(userController.createNewUser)    


router.route('/qrcode')
    .get(userController.generateQR)    

/*router.route('/:id')
    .get(userController.getUser);*/

module.exports = router;