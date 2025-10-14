const { header } = require('express-validator');
const jwt = require('jsonwebtoken');
const { RevokedToken } = require('../models/index');

    //MIDDLEWARE PARA PROTECCION DE USUARIOS NO AUTENTICADOS
    module.exports = async(req, res, next) => {
        try {


            //Obtener el token del header
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ message: 'Token invalido o no proporcionado.'})
            }

            const token = authHeader.split(' ')[1]; // Quita el "Bearer"

            //Verificar Token no cerro sesión
            const revoked = await RevokedToken.findOne({ where: { token } });
            if (revoked) {
                return res.status(401).json({ message: 'Token revocado. Inicia sesión nuevamente.' });
            }
            
            //Verificar Token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Guardar datos del usuario en req.user (disponible en las rutas)
            req.user = decoded;

            next();
        } catch (error) {
            return res.status(401).json({ message: 'Token inávlido o expirado'});
        }
    };
