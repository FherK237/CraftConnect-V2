const { Router } = require('express');
const ProfessionalController = require('../controllers/ProfessionalController.controller');
const verifyToken = require('../middlewares/verifyToken');
const checkRole = require('../middlewares/checkRole');
const { body } = require('express-validator');
const multer = require('multer');

    const upload = multer({ dest: 'src/uploads/images_service'});
    const router = Router();

    // FORMULARIO DE REGISTRO de servicio
    router.get('/service', verifyToken, checkRole(['professional']), ProfessionalController.formRegisterService);
   
    // Ruta POST REGISTRAR el servicio a la BASE DE DATOS
    router.post('/service/register', [
        // body('category_id').notEmpty().withMessage('La categoria no puede ser vacía.'),
        body('service_id').notEmpty().withMessage('El servicio no puede ser vacío.'),
        body('base_price')
            .notEmpty().withMessage('El precio base no puede ser vacío.')
            .isFloat({ gt: 0}).withMessage('El precio del servicio debe ser un numero mayor a 0.')
            .custom(value => value <= 10000000).withMessage('El precio base no puede exceder 1,000,000.'),
        body('professional_description').notEmpty().withMessage('La descripción del professional acerca de su servicio no puede ser vacía.'),
        body('image_description').notEmpty().withMessage('La descripción de las imagenes no puede ser vacía.')

    ],
    verifyToken, [
        body('service_id').notEmpty().withMessage('El servicio no puede ser vacío.'),
        body('base_precio')
            .notEmpty().withMessage('El servicio no puede ser vacío.')
            .isFloat({ gt: 0}).withMessage('El precio del servicio debe ser un número mayor a 0.')
            .custom(value => value <= 10000000).withMessage('El precio del servicio no puede exceder 1,000,000.'),
        body('professional_description').notEmpty().withMessage('La descripción del Professional acerca de su servicio no puede ser vacía.'),
        body('image_description').notEmpty().withMessage('La descripción de las imagenes no puede ser vacía.')
    ],
    checkRole(['professional']), 
    upload.array('images', 10),
    ProfessionalController.registerService
);

    // FORMULARIO DE ACTUALIZACION de servicio
    router.get('/update-service/:service_id/:professionalService_id', verifyToken, checkRole(['professional']), ProfessionalController.formUpdateService);

    // Ruta PUT ACTUALIZAR el servicio a la BASE DE DATOS
    router.put('/service/update/:service_id/:professionalService_id', [
        body('service_id').notEmpty().withMessage('El servicio no puede ser vacío.'),
        body('base_precio')
            .notEmpty().withMessage('El servicio no puede ser vacío.')
            .isFloat({ gt: 0}).withMessage('El precio del servicio debe ser un número mayor a 0.')
            .custom(value => value <= 10000000).withMessage('El precio del servicio no puede exceder 1,000,000.'),
        body('professional_description').notEmpty().withMessage('La descripción del Professional acerca de su servicio no puede ser vacía.'),
        body('image_description').notEmpty().withMessage('La descripción de las imagenes no puede ser vacía.')
    ],
    verifyToken,
    checkRole(['professional']),
    upload.array('images', 10),
    ProfessionalController.updateService
);

    router.put('/service/delete/:service_id/:professionalService_id', verifyToken, checkRole(['professional']), ProfessionalController.deactivateService);

    module.exports = router;