const { Router } = require('express');
const ProfessionalController = require('../controllers/ProfessionalController.controller');
const verifyToken = require('../middlewares/verifyToken');
const checkRole = require('../middlewares/checkRole');
const { body } = require('express-validator');
const multer = require('multer');
const verifyJWT = require('../middlewares/authMiddleware');

    const upload = multer({ dest: 'src/uploads/images_service'});
    const router = Router();

    // FORMULARIO DE REGISTRO de servicio
    router.get('/service/form-register', verifyToken, checkRole(['professional']), ProfessionalController.formRegisterService);

    // Ruta POST REGISTRAR el servicio a la BASE DE DATOS
    router.post('/service/register', 
    [
        body('service_id').notEmpty().withMessage('El servicio no puede ser vacío.'),
        body('base_price')
            .notEmpty().withMessage('El precio base no puede ser vacío.')
            .isFloat({ gt: 0}).withMessage('El precio del servicio debe ser un numero mayor a 0.')
            .custom(value => value <= 10000000).withMessage('El precio base no puede exceder 1,000,000.'),
        body('professional_description').notEmpty().withMessage('La descripción del professional acerca de su servicio no puede ser vacía.'),
        body('image_description').notEmpty().withMessage('La descripción de las imagenes no puede ser vacía.')

    ],
    verifyToken,
    checkRole(['professional']), 
    upload.array('images', 10),
    ProfessionalController.registerService
    );

    // FORMULARIO DE ACTUALIZACION de servicio
    router.get('/service/form-update/:service_id/:professionalService_id', verifyToken, checkRole(['professional']), ProfessionalController.formUpdateService);

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

    // Ruta PUT dar de baja el servicio a la BASE DE DATOS
    router.put('/service/deactivate/:service_id/:professionalService_id', verifyToken, checkRole(['professional']), ProfessionalController.deactivateService);

    // Ruta horarios del professional (dashboard)
    router.get('/schedule', verifyToken, checkRole(['professional']), ProfessionalController.Schedule);

    // Ruta POST REGISTRAR el horario a la BASE DE DATOS
    router.post('/schedule/register',[
        body('day_of_week')
            .notEmpty().withMessage('El dia de la semana no puede ser vacío.')
            .isIn(['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo']).withMessage('El día de la semana debe ser válido.'),
        body('start_time')
            .notEmpty().withMessage('Hora de inicio no puede ser vacía.')
            .matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Formato de hora inválido (HH:mm).'),
        body('end_time')
            .notEmpty().withMessage('Hora de fin no puede ser vacía.')
            .matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Formato de hora inválido (HH:mm).'),
        // body().custom((value, { req }) => {
        //     const { start_time, end_time } = req.body;
        //     if (start_time >= end_time ) throw new Error('La hora de inicio debe ser menor que la hora de fin.');
        // })
    ],
    verifyToken, 
    checkRole(['professional']), 
    ProfessionalController.registerSchedule
    );

    // FORMULARIO DE ACTUALIZACION DEL horario
    router.get('/schedule/form-update/:schedule_id', verifyToken, checkRole(['professional']), ProfessionalController.formUpdateSchedule);

    // Ruta PUT ACTUALIZAR el horario del professional
    router.put('/schedule/update/:schedule_id', [
        body('day_of_week')
            .notEmpty().withMessage('El dia de la semana no puede ser vacío.')
            .isIn(['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo']).withMessage('El día de la semana debe ser válido.'),
        body('start_time')
            .notEmpty().withMessage('Hora de inicio no puede ser vacía.')
            .matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Formato de hora inválido (HH:mm).'),
        body('end_time')
            .notEmpty().withMessage('Hora de fin no puede ser vacía.')
            .matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Formato de hora inválido (HH:mm).'),
        body().custom((value, { req }) => {
            const { start_time, end_time } = req.body;
            if (start_time >= end_time ) throw new Error('La hora de inicio debe ser menor que la hora de fin.');
        }),

    ], 
    verifyToken, 
    checkRole(['professional']),
    ProfessionalController.updateSchedule
    );

    // Ruta PUT Para dar de baja el horario (por día)
    router.put('/schedule/deactivate/:schedule_id', verifyToken, checkRole(['professional']), ProfessionalController.deactivateSchedule);

    // Ruta Get de los portafolios del fixer 
    router.get('/portfolio', verifyToken, checkRole(['professional']), ProfessionalController.getPortfolios);
    
    // Ruta para el formulario de registro
    router.get('/portfolio/form-register/:contract_id', verifyToken, checkRole(['professional']), ProfessionalController.formRegisterPortfolio);

    // Ruta POST REGISTRAR el portafolio a la BASE DE DATOS
    router.post('/portfolio/register',
        upload.array('images', 10),
        [
            body('title').notEmpty().withMessage('El título del portafolio no puede ser vacío.'),
            body('completion_date').notEmpty().withMessage('La fecha de realización del servicio no puede ser vacía.'),
            body('description').notEmpty().withMessage('La descripción del portafolio no puede ser vacía.'),
            body('image_description').notEmpty().withMessage('La descripción de las imagenes no puede ser vacía.')
        ],
        verifyToken, 
        checkRole(['professional']),
        ProfessionalController.registerPortfolio
    );

    // Ruta para Formulario de actualizar portafolio
    router.get('/portfolio/form-update/:portfolio_id/:contract_id', verifyToken, checkRole(['professional']), ProfessionalController.formUpdatePortfolio);

    // Ruta PUT ACTUALIZAR PORTAFOLIO
    router.put('/portfolio/update/:portfolio_id/:contract_id',
        upload.array('images', 10),
        [
            body('title').notEmpty().withMessage('El título del portafolio no puede ser vacío.'),
            body('completion_date').notEmpty().withMessage('La fecha de realización del servicio no puede ser vacía.'),
            body('description').notEmpty().withMessage('La descripción del portafolio no puede ser vacía.'),
            body('images_data').notEmpty().withMessage('La descripción de las imagenes no puede ser vacía.')
        ],
    ProfessionalController.updatePortfolio);

    // Ruta PUT Para dar de baja un portafolio
    router.put('/portfolio/deactivate/:portfolio_id/:contract_id', verifyToken, checkRole(['professional']), ProfessionalController.deactivatePortfolio);

    //  Ruta para cambiar el switch la disponibilidad del fixer: Disponible(true), Ocupado (false).
    router.put('/availability', verifyJWT, ProfessionalController.SwitchAvailable);


    module.exports = router;