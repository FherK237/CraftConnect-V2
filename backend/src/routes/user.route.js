const { Router } = require('express');
const UserController = require('../controllers/UserController.controller');
const multer = require('multer');

    const router = Router();

    //Ruta para ver lista de oficios
    router.get('/jobs', UserController.getJobTittles);

    //Ruta para ver fixers por oficio
    router.get('/fixers/search', UserController.searchFixers);

    //Ruta para visualizar perfil especifico de Fixer
    router.get('/fixers/:id', UserController.getFixerProfilePublic);

    module.exports = router;