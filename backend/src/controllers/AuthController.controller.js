const { User, Professional, RevokedToken, Jobs} = require('../models/index');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { sendVerificationEmail, sendResetPasswordEmail } = require('../utils/email'); 
const crypto = require('crypto');
const { sequelize, Op } = require('sequelize');
const nodemailer = require('nodemailer');
const { profile } = require('console');

require('dotenv').config();

    exports.formRegisterUser = async(req, res) => {
        try {
            res.send('Formulario de Registro de usuarios');
        } catch (error) {
            console.log(error);
            res.status(500).json({message: error.message});
        }
    }

    exports.formRegisterProfessional = async(req, res) => {
        try {
            res.send('Formulario de Registro del professional');
        } catch (error) {
            console.log(error);
            res.status(500).json({message: error.message});
        }
    }

    exports.register = async(req, res) => {

        try {
            //Validar campos
            const errors = validationResult(req);
            if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

            const { firstname, lastname, email, password, role } = req.body;

            //Validar que se hayan enviado los campos:
            if ( !firstname || !lastname || !email || !role ) {
                return res.status(400).json({message: 'Todos los campos son obligatorios'});
            }
            
            // Validar que no exista un email duplicado en users o profesionales
            const existingEmail =
            ( await User.findOne({ where: { email }}) ) || ( await Professional.findOne({ where: { email }}) );
            if (existingEmail) return res.status(400).json({ message: 'El correo ya esta registrado, intente con uno nuevo.'});

            //GENERAR UN JSON WEB TOKEN PARA UN VALIDACION MAS SEGURA
            const verificationToken = jwt.sign(
                {email: email, scope: 'email-verification'},
                process.env.JWT_SECRET,
                { expiresIn: '1h' } //Token que expira en una hora
            );

            //Encriptar la contraseña
            const hashedPassoword = await bcrypt.hash(password, 10);

            let user;
            // Crear usuario segun el rol
            if (role === 'user') {
                user = await User.create({
                    firstname: firstname,
                    lastname: lastname,
                    email: email,
                    password: hashedPassoword,
                    role: 'user'
                });
            } else if (role === 'professional'){
                user = await Professional.create({
                    firstname: firstname,
                    lastname: lastname,
                    email: email,
                    password: hashedPassoword,
                    role: 'professional'
                });
            } else {
                return res.status(400).json({ message: 'Rol inválido.' });
            }


            const verificationLink = `http://localhost:3001/api/auth/verify?token=${encodeURIComponent(verificationToken)}`;

            //Enviar el correo de verificacion
            await sendVerificationEmail(email, verificationLink);

            res.status(201).json({
                message:  `Usuario creado. Revisa tu correo: ${email} para activar tu cuenta.`,
                verification_token_info: 'El enlace de activacion ha sido enviado al correo registrado.'
            });

        } catch (error) {
            console.error('Error en el registro: ', error);
            res.status(500).json({ message: 'Error en el servidor intentalo más tarde.' });
        }
    }

    exports.verifyAccount = async (req, res) => {
        try {
            const { token } = req.query;
            console.log("Token recibido en /verify:", token);
            
            if (!token) return res.status(400).json({ message: "Token requerido" });

            const decoded = jwt.verify(decodeURIComponent(token), process.env.JWT_SECRET);
            const email = decoded.email.toLowerCase();

            let [updatedRows] = await User.update({ is_verified: true }, { where: { email } });
            
            if (updatedRows === 0 ) {
                [updatedRows] = await Professional.update({ is_verified: true}, { where: { email } }); 
            }

            if (updatedRows === 0 ) return res.status(404).json({ message: "Usuario no encontrado"});

            return res.json({ message: "Cuenta verificada correctamente. Ya puedes iniciar sesión."});
        } catch(error) {
            console.log("Error en /verify", error);
            if (error.name === 'tokenExpiredError') {
                return res.status(400).json({ message: "El enlace ha expirado"});
            }
            return res.status(400).json({ message: "Enlace invalido"});
        }
    };

    exports.FormloginUser = async(req, res) => {
        try {
            res.send('Formulario de inicio de sesion del usuario');
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    
    exports.FormloginProfessional = async(req, res) => {
        try {
            res.send('Formulario de inicio de sesion del profesional');
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    exports.login = async(req, res) => {
        try {

            //Validar campos
            const errors = validationResult(req);
            if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
        
            const { email, password } = req.body;

            if (!email || !password ) return res.status(400).json({ message: 'El correo y contraseña son campos obligatorios' });

            //Buscar el email en ambas tablas
            let existingUser = await User.findOne({ where: { email }})
            let role = 'user';

            if (!existingUser) {
                existingUser = await Professional.findOne({ where: { email }});
                if (existingUser) {
                    role = existingUser.role;
                }
            }

            if (!existingUser) return res.status(404).json({message: 'Usuario no encontrado'});
        
            // Verificar si la cuenta está bloqueada
            if (existingUser.lockUntil && existingUser.lockUntil > new Date()) {
            const minutes = Math.ceil((existingUser.lockUntil - new Date()) / 60000);
            return res.status(403).json({ msg: `Cuenta bloqueada temporalmente. Intenta en ${minutes} minutos.` });
            }

            // Comparar contraseñas
            const validPassword = await bcrypt.compare(password, existingUser.password);

            //Si la contraseña es incorrecta
            if (!validPassword) {
                // Incrementar intentos fallidos
                existingUser.failedAttempts = (existingUser.failedAttempts || 0) + 1;

                // Si supera 5 intentos, bloquear por 15 minutos
                if (existingUser.failedAttempts >= 5) {
                    existingUser.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 min
                }
                return res.status(401).json({ msg: 'Contraseña incorrecta.' });
            }    

            // Resetear intentos y bloqueo si la contraseña es correcta
            existingUser.failedAttempts = 0;
            existingUser.lockUntil = null;
            await existingUser.save();

            // Generar token con el rol detectado
            const token = jwt.sign(
            { id: existingUser.id, role },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
            );

            // Determinar la redirección según el rol
            const redirectUrl = role === 'user'
                ? '/dashboard-user'
                : '/api/auth/profile';


            res.status(200).json({
                msg: 'Inicio de sesión exitoso.',
                    user: {
                        id: existingUser.id,
                        name: existingUser.firstname,
                        email: existingUser.email,
                        role
                    },
                token,
                redirectUrl
            });
                            
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: error.message });
        }
    } 

    exports.logout = async(req, res) => {
        try {
            console.log('Headers:', req.headers);

            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(400).json({ message: 'Token requerido o formato inválido.' });
            }

            const token = authHeader.split(' ')[1];

            const decoded = jwt.decode(token);
            if (!decoded || !decoded.exp) {
                return res.status(400).json({ message: 'Token inválido.' });
            }

            await RevokedToken.create({ token: token, exp: new Date(decoded.exp * 1000) });

            res.status(200).json({message: 'Sesión cerrada correctamente.'});

        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: error.message });
        }
    }

    exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        
        // 1. Buscar usuario en ambas tablas
        let existingUser = await User.findOne({ where: { email } });
        if (!existingUser) {
            existingUser = await Professional.findOne({ where: { email } });
        }

        // 2. Si el usuario no existe, devolvemos un mensaje genérico por seguridad
        if (!existingUser) {
            return res.status(200).json({ message: 'Recibirás un enlace para restablecer tu contraseña.' });
        }

        // 3. Generar Token Único y Temporal (ej: usando crypto o JWT)
        const resetToken = crypto.randomBytes(32).toString('hex');
        const tokenExpiry = new Date(Date.now() + 3600000); // Token válido por 1 hora (3600000 ms)
        existingUser.resetTokenExpiry = tokenExpiry;
        await existingUser.save();

        // 4. Guardar Token y Expiración en la base de datos
        existingUser.resetToken = resetToken;
        existingUser.resetTokenExpiry = tokenExpiry;
        await existingUser.save();

        // 5. Crear el enlace de restablecimiento
        const resetLink = `http://localhost:3001/api/auth/reset-password/${resetToken}`;

        // 6. Enviar el email
        await sendResetPasswordEmail(email, resetLink); // <-- Necesitas implementar esta función de email

        res.status(200).json({ 
            message: 'Si el correo existe, recibirás un enlace para restablecer tu contraseña.',
            // Opcional: Esto es solo para pruebas en desarrollo, no lo muestres en producción:
            dev_info: { token: resetToken, link: resetLink } 
        });

    } catch (error) {
        console.error('Error en forgotPassword:', error);
        res.status(500).json({ message: 'Error interno del servidor al procesar la solicitud.' });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        // El token se recibe en la URL (parámetro de ruta) o en el cuerpo. Usaremos URL para este ejemplo.
        const token = req.params.token; // Si lo pasas como /api/auth/reset-password/:token
        const { password } = req.body; // Recibir la nueva contraseña

        // 1. Buscar usuario por el token y verificar que no haya expirado
        let existingUser = await User.findOne({ where: {
            resetToken: token,
            resetTokenExpiry: { [Op.gt]: new Date() }
        } });
        
        if (!existingUser) {
            // Si no se encuentra en User, buscar en Professional
            existingUser = await Professional.findOne({ where: {
                resetToken: token,
                resetTokenExpiry: { [Op.gt]: new Date() }
            } });
        }

        // 2. Si el usuario no existe o el token expiró, fallar
        if (!existingUser) {
            return res.status(400).json({ message: 'El enlace para restablecer la contraseña es inválido o ha expirado.' });
        }

        // 3. Hashear y actualizar la nueva contraseña
        const hashedPassoword = await bcrypt.hash(password, 10);
        existingUser.password = hashedPassoword;

        // 4. Limpiar el token de restablecimiento para que no se pueda usar de nuevo
        existingUser.resetToken = null;
        existingUser.resetTokenExpiry = null;
        await existingUser.save();

        res.status(200).json({ message: 'Contraseña actualizada con éxito. Ya puedes iniciar sesión.' });

    } catch (error) {
        console.error('Error en resetPassword:', error);
        res.status(500).json({ message: 'Error interno del servidor al restablecer la contraseña.' });
    }
};

exports.changePassword = async(req,res) => {
    try {   

        const user = req.user;

        if (!user || !user.id) {
            return res.status(401).json({ message: "Acceso denegado. Usuario no autenticado."});
        }

        const { oldPassword, newPassword, confirmNewPassword } = req.body;

       
        if (!oldPassword || !newPassword || !confirmNewPassword) {
            return res.status(400).json({ message: "Todos los campos son obligatorios."});
        }

        if (newPassword !== confirmNewPassword ) {
            return res.status(400).json({ message: "Las contraseñas nuevas no coinciden"});
        }

        if (oldPassword === newPassword ) {
            return res.status(400).json({ message: "La contraseña nueva debe ser diferente a la anterior."})

        }

        console.log('Password del Cliente:', oldPassword);
        console.log('Hash de la DB:', user.password);

        const isMatch =await bcrypt.compare(oldPassword, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "La contraseña actual es incorrecta."})
        }

        const hashedPassoword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassoword;

        await user.save()

        res.status(200).json({ message: 'Contraseña actualizada con exito.'});
    } catch (error) {
        console.error('Error al cambiaar contraseña:', error);
        res.status(500).json({ message: 'Error interno del servidor al cambiar contraseña.'});
    }
};
    module.exports = {
        formRegisterUser: this.formRegisterUser,
        formRegisterProfessional: this.formRegisterProfessional,
        register: this.register,
        FormloginUser: this.FormloginUser,
        FormloginProfessional: this.FormloginProfessional,
        login: this.login,
        logout: this.logout,
        verifyAccount: this.verifyAccount,
        forgotPassword: this.forgotPassword,
        resetPassword: this.resetPassword,
        changePassword: this.changePassword
    }