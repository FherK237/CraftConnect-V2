const { Router } = require('express');
const UserController = require('../controllers/UserController.controller');
const multer = require('multer');

const router = Router();

//Ruta para ver lista de oficios
router.get('/', UserController.getJobTittles);

module.exports = router;