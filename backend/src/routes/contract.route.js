const { Router } = require("express")
const ContractController = require('../controllers/ContractController.controller');
const verifyJWT = require('../middlewares/authMiddleware');
const verifyToken = require("../middlewares/verifyToken")
const checkRole = require("../middlewares/checkRole")

const router = Router();

// FIXER crea el contrato
router.post('/create', verifyJWT, ContractController.createContract);

// Cliente confirma la propuesta de contrato
router.patch('/:contractId/confirm', verifyJWT, ContractController.confirmContract);

router.patch('/:contractId/complete', verifyJWT, ContractController.completeContract);

router.put('/:contractId/edit', verifyJWT, ContractController.editContract);

router.get('/:contractId/view', verifyJWT, ContractController.viewContract);

router.get('/conversations', verifyJWT, ContractController.getConversationList);

router.get('/:contractId/pdf', verifyJWT, ContractController.generateContractPDF);

router.post('/reviews', 
    verifyToken, // Middleware para verificar el JWT del usuario
    checkRole(['user']), // Middleware para asegurar que solo los CLIENTES accedan
    ContractController.registerReview
);

module.exports = router;