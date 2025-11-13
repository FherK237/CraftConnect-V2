const { Router } = require("express")
const ContractController = require('../controllers/ContractController.controller');
const verifyJWT = require('../middlewares/authMiddleware');

const router = Router();

// FIXER crea el contrato
router.post('/create', verifyJWT, ContractController.createContract);

// Cliente confirma la propuesta de contrato
router.patch('/:contractId/confirm', verifyJWT, ContractController.confirmContract);

router.patch('/:contractId/complete', verifyJWT, ContractController.completeContract);

router.put('/:contractId/edit', verifyJWT, ContractController.editContract);

router.get('/:contractId/view', verifyJWT, ContractController.viewContract);

module.exports = router;