const { Router } = require('express');
const ProfileController = require('../controllers/ProfileController.controller');
const verifyToken = require('../middlewares/verifyToken');
const checkRole = require('../middlewares/checkRole');
const { body } = require('express-validator');
const multer = require('multer');

const upload = require('../middlewares/uploadMiddleware')

    const router = Router();

        // Ruta GET para mostrar el formulario y datos del usuario
        router.get('/user', verifyToken, checkRole(['user']), ProfileController.formConfigureUser);

        // Ruta GET para mostrar el formulario y datos del profesional
        router.get('/me', verifyToken, checkRole(['fixer']), ProfileController.formConfigureFixer);
        
        // Ruta PUT de Personalizacion/Configuracion del usuario
        router.put('/configure-user',
            upload.single('image_user'),  
            verifyToken, 
            checkRole(['user']), 
            ProfileController.ConfigureUser,
        );
        
        // Ruta PUT de Personalizacion/Configuracion de fixer
        router.put('/f-update',
            verifyToken,
            upload.single('image_user'),
            ProfileController.ConfigureFixer
        );

//RUTA PUT para subir INE
        router.put('/configure-ine', 
            upload.fields([
                { name: 'image_ine_front', maxCount: 1},
                { name: 'image_ine_back', maxCount: 1}
            ]),
            verifyToken,
            checkRole(['fixer']),
            ProfileController.IneFixer
        );

        module.exports = router;