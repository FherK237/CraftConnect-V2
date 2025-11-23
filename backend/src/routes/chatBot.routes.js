const { Router } = require('express');
const { body } = require('express-validator');
const ChatBotController = require('../controllers/ChatBotController.controller');
const verifyToken = require('../middlewares/verifyToken');
const checkRole = require('../middlewares/checkRole');

    const router = Router();

    router.post('/chat', [
        body('message')
            .notEmpty().withMessage('Mensaje bloqueado. Por favor, El mensaje no puede ser vacío.')
            .isLength({ max: 800 }).withMessage('Mensaje bloqueado. Por favor, no exceda los 800 caracteres')            
    ],
    verifyToken,
    checkRole(['professional']),
    ChatBotController.chatGetResponse);

    module.exports = router;