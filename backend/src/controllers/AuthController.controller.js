const { User, Professional, Role } = require('../models/index');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
    

    const RegisterForm = async(req, res) => {
        
        try {

            res.send('Formulario de registro');

        } catch (error) {
            res.status(500).json({message: 'Error de configuración interna', error: error.message})
        }
    }

    const register = async(req, res) => {
        
        try {
            
            const { name, last_name, email, password, accountType } = req.body;
            
            // 1. Validación Básica
            if ( !email || !password ) return res.status(400).json({ message: 'El Correo y Contraseña son obligatorios.' });
            if( !name || !last_name ) return res.status(400).json({message: 'El nombre(s) y Apellidos son obligatorios'});
           
            // 2. Hash de Contraseña
            const hashedPassword = await bcrypt.hash(password, 10);

            // 3. Determinar el rol y el modelo a usar
            const rol_name = accountType ? 'Professional' : 'User'; 

            const rol = await Role.findOne({ where: { name: rol_name }}); // determinar el id

            if (!rol) return res.status(500).json({message: `El rol: ${rol_name} no existe.`})

            let newUser;
            let rol_id = rol.id;

                if (accountType) {
                    //registrarse como profesional
        
                    newUser = await Professional.create({
                        name: name,
                        last_name: last_name,
                        email: email,
                        password: hashedPassword,
                        role_id: rol_id
                    });

                } else {
                    // registrarse como usuario
                    
                    newUser = await User.create({
                        name: name,
                        last_name: last_name,
                        email: email,
                        password: hashedPassword,
                        role_id: rol_id
                    });

                }

            // 4. Generar Token
            const token = jwt.sign(
                { id: newUser.id, rol_id: rol_id, type: accountType ? 'Professional' : 'User' },
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            );

            // 5. Respuesta
            return res.status(201).json({
                message: 'Registro exitoso.', 
                token, 
                user: { id: newUser.id, email: newUser.email, type: accountType ? 'Professional' : 'User'},
            });

        } catch (error) {
            // Maneja el error de email duplicado (Sequelize validation error)
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(409).json({ message: 'El email ya está registrado.' }); 
            }
            console.log(error);
            
                return res.status(500).json({ // ✅ res.status(500) es una función
                    message: 'Error interno del servidor.', 
                    error: error.message 
                });
        }

    }

    const login = async(req, res) => {
        // 1. Obtener credenciales
        const { email, password } = req.body;
        //2. Validar credenciales
        if (!email || !password) return res.status(500).json({message: 'El correo y la Contraseña son obligatorios.'});
        try {

        // 3. Buscar al usuario/profesional por email

        //Buscar en profesionals
        let foundUser = await Professional.findOne({ where: {email: email}});
        //Buscar en Users
        let isProfessional = true;
        
        if (!foundUser) { 
            foundUser = await User.findOne({ where: {email: email}});
            isProfessional = false;
        }

        // 3. Verificar si el usuario existe
        if (!foundUser) {
            return res.status(401).json({message: 'Credenciales inválidas (Usuario no encontrado).'});
        }

        // 4. Comparar contraseñas
        const ismatch = await bcrypt.compare(password, foundUser.password);

        if (!ismatch) return res.status(401).json({ message: 'Credenciales inválidas (Contraseña incorrecta).'});

        // 5. Generar Token JWT
        const accountType = isProfessional ? 'Professional' : 'User'

        const token = jwt.sign(
            {
                id: foundUser.id,
                rol_id: foundUser.rol_id,
                accountType: accountType,
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d'}
        );

        // 6. Respuesta de éxito
        res.status(201).json({
            message: 'Inicio de sesión con Exito',
            token, 
            user: { id: foundUser.id, rol_id: foundUser.rol_id, type: accountType}
        });

        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: 'Error interno del servidor.',
                error: error.message
            });
        }
    }

    module.exports = {
        RegisterForm: RegisterForm,
        register: register,
        login: login
    }