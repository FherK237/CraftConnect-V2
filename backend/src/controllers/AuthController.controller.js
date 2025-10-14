const { User, Professional, RevokedToken } = require('../models/index');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const {sendVerificationEmail} = require('../utils/email');

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
            if ( !firstname || !lastname || !email || !role ) return res.status(400).json({message: 'Todos los campos son obligatorios'});

            // Validar que no exista un email duplicado en users o profesionales
            const existingEmail = 
            ( await User.findOne({ where: { email }}) ) || ( await Professional.findOne({ where: { email }}) );
            // if (existingEmail) return res.status(400).json({ message: 'El correo ya esta registrado.'});

            // //Encriptar la contraseña
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

            // Generar Token 
            const payload = { id: user.id, email: user.email, role};
            const token = jwt.sign( payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES || '1d'} );

            const verificationLink = `http://localhost:3000/api/auth/verify?token=${encodeURIComponent(token)}`;

            await sendVerificationEmail(email, verificationLink);

            res.status(201).json({
                message:  `Usuario creado. Revisa tu correo para verificar tu cuenta.`,
                token,
                user: { id: user.id, email: user.email, role }
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: error.message });
        }
    }

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

            if (!email || !password ) return res.status(400).json({ message: 'El correo y contraseña son campos son obligatorios' });

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

    module.exports = {
        formRegisterUser: this.formRegisterUser,
        formRegisterProfessional: this.formRegisterProfessional,
        register: this.register,
        FormloginUser: this.FormloginUser,
        FormloginProfessional: this.FormloginProfessional,
        login: this.login,
        logout: this.logout
    }