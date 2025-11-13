// Paso 1: Importar Nodemailer
const nodemailer = require('nodemailer');

// Paso 2: Cargar las variables de entorno si aún no lo has hecho
// Asegúrate de que tu archivo .env tenga MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASS
require('dotenv').config(); 

// Paso 3: Crear el objeto Transporter
// Este objeto contiene la configuración de tu servidor de correo (SMTP)
const transporter = nodemailer.createTransport({
    // Generalmente es el servidor SMTP de tu proveedor de correo (ej: 'smtp.gmail.com')
    host: process.env.MAIL_HOST, 
    // Puerto de conexión (comúnmente 587 con TLS o 465 con SSL/TLS)
    port: process.env.MAIL_PORT,
    secure: true,
    // secure: process.env.MAIL_PORT == 465, // True para puerto 465, false para otros (como 587)
    auth: {
        // Tu dirección de correo para enviar emails (ej: no-reply@crafterconnect.com)
        user: process.env.MAIL_USER, 
        // La contraseña o clave de aplicación de tu correo (¡IMPORTANTE! No la contraseña normal)
        pass: process.env.MAIL_PASS 
    },
    // Opcional: Para evitar problemas con certificados SSL/TLS en entornos de desarrollo (NO USAR EN PRODUCCIÓN)
    tls: {
        rejectUnauthorized: false
    }

    
});

transporter.verify(function (error, success) {
    if (error) {
        console.error("ERROR de Conexión de NODEMAILER:", error);
    } else {
        console.log("Servidor de Correo listo para enviar mensajes.");
    }
});

// Paso 4: Exportar el Transporter para usarlo en 'emailService.js'
module.exports = transporter;