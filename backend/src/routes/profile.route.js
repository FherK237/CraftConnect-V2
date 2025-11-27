const { Router } = require('express');
const ProfileController = require('../controllers/ProfileController.controller');
const verifyToken = require('../middlewares/verifyToken');
const checkRole = require('../middlewares/checkRole');
const { body } = require('express-validator');
const multer = require('multer');

    const upload = multer({dest: 'src/uploads/profiles'});

    const router = Router();

        // Ruta GET para mostrar el formulario y datos del usuario
        router.get('/user', verifyToken, checkRole(['user']), ProfileController.formConfigureUser);

        // Ruta GET para mostrar el formulario y datos del profesional
        router.get('/fixer', verifyToken, checkRole(['professional']), ProfileController.formConfigureProfessional);
        
        // Ruta PUT de Personalizacion/Configuracion del usuario
        router.put('/configure-user',
            upload.single('picture'), 
            [
                body('firstname').notEmpty().withMessage('El nombre no puede ser vacío.'),
                body('lastname').notEmpty().withMessage('Los apeliidos no pueden ser vacios.'),
            ], 
            verifyToken, 
            checkRole(['user']), 
            ProfileController.ConfigureUser,
        );
        
        // Ruta PUT de Personalizacion/Configuracion de profesional
        router.put('/configure-fixer',
            upload.single('picture'),
            [
                body('firstname').notEmpty().withMessage('El nombre no puede ser vacío.'),
                body('lastname').notEmpty().withMessage('Los Apellidos no puede ser vacios.')
            ], 
            verifyToken, 
            checkRole(['professional']), 
            ProfileController.ConfigureProfessional
        );

//RUTA PUT para subir INE
        router.put('/configure-ine', 
            upload.fields([
                { name: 'image_ine_front', maxCount: 1},
                { name: 'image_ine_back', maxCount: 1}
            ]),
            verifyToken,
            checkRole(['professional']),
            ProfileController.IneProfessional
        );

        module.exports = router;