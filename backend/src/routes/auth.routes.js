const { Router } = require('express');
const { body } = require('express-validator');
const verifyToken = require('../middlewares/verifyToken');
const checkRole = require('../middlewares/checkRole');
const jwt = require('jsonwebtoken');
const { User, Professional } = require('../models/index');

    const router = Router();

    const AuthController = require('../controllers/AuthController.controller');
    const verifyJWT = require('../middlewares/authMiddleware');

    //Para los formularios de registro
    router.get('/register/user', AuthController.formRegisterUser);
    router.get('/register/professional', AuthController.formRegisterProfessional);

    //Registro
    router.post('/register', [
        body('firstname').notEmpty().withMessage('El nombre es obligatorio.'),
        body('lastname').notEmpty().withMessage('Los Apeliidos son obligatorios.'),
        body('email').isEmail().withMessage('Correo electrónico inválido.'),
        body('role').notEmpty().withMessage('EL rol es obligatorio.'),
        body('password')
        .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres.')
        .matches(/[A-Z]/).withMessage('La contraseña debe tener al menos una mayuscula.')
    ],
    AuthController.register);

    //Para los formularios de incio de sesion
    router.get('/login/user', AuthController.FormloginUser);
    router.get('/login/professional', AuthController.FormloginProfessional);

    //Inicio de sesion
    router.post('/login',[
        body('email').notEmpty()
            .withMessage('El email es obligatorio.')
            .isEmail().withMessage('Correo electrónico inválido.'),
        body('password').notEmpty().withMessage('La contraseña es obligatoria.')
    ],
    AuthController.login);

    //Cerrar sesion
    router.post('/logout', AuthController.logout);

    //ruta para probar el middlware
    router.get('/profile', verifyToken, checkRole(['professional']), async(req, res) => {
        res.json({
            msg: "Bienvenido",
            UserId: req.user.id
        });
    });

    router.get('/verify', async (req, res) => {
        try {
            const { token } = req.query;
            console.log("Token recibido en /verify:", token); // <-- VERIFICA qué llega

            if (!token) return res.status(400).json({ message: 'Token requerido' });

            const decoded = jwt.verify(decodeURIComponent(token), process.env.JWT_SECRET); // <- decodificar aquí
            const email = decoded.email.toLowerCase();
            let [updatedRows] = await User.update({ is_verified: true }, { where: { email } });
            if (updatedRows === 0) {
                [updatedRows] = await Professional.update({ is_verified: true }, { where: { email } });
            }
            if (updatedRows === 0) return res.status(404).json({ message: 'Usuario no encontrado.' });

            return res.json({ message: 'Cuenta verificada correctamente. Ya puedes iniciar sesión.' });

        } catch (error) {
            console.log("Error en /verify:", error); // <-- imprime el error
            if (error.name === 'TokenExpiredError') {
                return res.status(400).json({ message: 'El enlace ha expirado.' });
            }
            return res.status(400).json({ message: 'Enlace inválido.' });
        }
    });

    //Solicitud de restablecimiento (se envia el email)
    router.post('/forgot-password', AuthController.forgotPassword);

    //Aplicacion de restablecimiento (Recibe la nueva contraseña y el token de la URL)
    router.post('/reset-password/:token', AuthController.resetPassword);
    //Ruta para cambiar contraseña en caso que se haya olvidado o quiera cambiar
    router.post('/change-password', verifyJWT, AuthController.changePassword);

    module.exports = router;
