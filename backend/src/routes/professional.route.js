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
    router.get('/service', verifyToken, checkRole(['professional']), ProfessionalController.formRegisterService);
    
    // Ruta POST REGISTRAR el servicio a la BASE DE DATOS
    router.post('/service/register', [
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
        body().custom((value, { req }) => {
            const { start_time, end_time } = req.body;
            if (start_time >= end_time ) throw new Error('La hora de inicio debe ser menor que la hora de fin.');
        })
    ],
    verifyToken, 
    checkRole(['professional']), 
    ProfessionalController.registerSchedule
    );
    // FORMULARIO DE ACTUALIZACION DEL horario
    router.get('/schedule/update-schedule/:schedule_id', verifyToken, checkRole(['professional']), ProfessionalController.formUpdateSchedule);
    // Ruta PUT ACTUALIZAR el horario del professional
    router.put('/schedule/update/:schedule_id',[
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


    //  Ruta para cambiar el switch la disponibilidad del fixer: Disponible(true), Ocupado (false).
    router.put('/availability', verifyJWT, ProfessionalController.SwitchAvailable);

  


    module.exports = router;