const { Router } = require('express');


    const router = Router();

    const AuthController = require('../controllers/AuthController.controller');

    router.get('/form-register', AuthController.RegisterForm);
    router.post('/register', AuthController.register);
    router.post('/login', AuthController.login);

    module.exports = router;
