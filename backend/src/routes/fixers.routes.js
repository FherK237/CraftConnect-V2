const { Router } = require('express');
const UserController = require('../controllers/UserController.controller');
const multer = require('multer');

    const router = Router();

    //Ruta para ver fixers por oficio
    router.get('/', UserController.searchFixers);

    //Ruta para visualizar perfil especifico de Fixer
    router.get('/:id', UserController.getFixerProfilePublic);

    module.exports = router;