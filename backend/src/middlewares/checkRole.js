    // MIDDLEWARE PARA PROTECCION DE USUARIOS CON ROLES

    module.exports = (rolesPermitidos) => {
        return (req, res, next) => {
            const { role } = req.user;
            console.log(role);
            
            if (!rolesPermitidos.includes(role)) {
                return res.status(403).json({ message: 'Acceso denegado: rol no autorizado.' });
            }

            next();
        }
    }