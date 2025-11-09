const { Router } = require('express');
const { body } = require('express-validator');
const ChatBotController = require('../controllers/ChatBotController.controller');

    const router = Router();

    router.post('/chat', [
        body('message')
            .notEmpty().withMessage('Mensaje bloqueado. Por favor, El mensaje no puede ser vacío.')
            .custom(value => value <= 800).withMessage('ensaje bloqueado. Por favor, no exceda los 800 caracteres')            
    ],
    ChatBotController.chatGetResponse);

    module.exports = router;