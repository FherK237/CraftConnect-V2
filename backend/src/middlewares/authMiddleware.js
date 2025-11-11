const jwt = require('jsonwebtoken');
const { User, Professional } = require('../models/index'); // Importa ambos modelos

// Asegúrate de que tu archivo .env esté cargado
require('dotenv').config();

const verifyJWT = async (req, res, next) => {
    // 1. Obtener la cabecera de autorización
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado o formato inválido.' });
    }

    // 2. Extraer el token
    const token = authHeader.split(' ')[1];

    try {
        // 3. Verificar y Decodificar el token usando tu JWT_SECRET
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 4. Buscar el usuario en la base de datos (usando el ID y rol decodificados)
        let existingUser;
        
        // Determinar qué modelo buscar basado en el 'role' guardado en el token
        if (decoded.role === 'user') {
            existingUser = await User.findByPk(decoded.id);
        } else if (decoded.role === 'professional') {
            existingUser = await Professional.findByPk(decoded.id);
        }

        // 5. Si el usuario no existe (o el ID es inválido)
        if (!existingUser) {
            return res.status(401).json({ message: 'Token inválido: Usuario no encontrado.' });
        }

        // 6. ADJUNTAR el objeto del usuario a la solicitud (CRUCIAL para changePassword)
        // La función changePassword usará este objeto 'req.user'
        req.user = existingUser; 

        // 7. Continuar al siguiente middleware/controlador
        next();

    } catch (error) {
        // Si el token expiró, es inválido (firma errónea), etc.
        if (error.name === 'TokenExpiredError') {
             return res.status(401).json({ message: 'Token expirado. Por favor, inicia sesión de nuevo.' });
        }
        return res.status(401).json({ message: 'Token de autenticación inválido.' });
    }
};

module.exports = verifyJWT;