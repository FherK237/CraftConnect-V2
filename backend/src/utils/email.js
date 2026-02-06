// En tu archivo de utilidades/configuración de Nodemailer

const transporter = require('../config/nodemailerConfig') // Tu transporter configurado

// La función debe recibir el correo del usuario y el enlace completo
exports.sendVerificationEmail = async (email, link) => {
    const mailOptions = {
        from: '"CrafterConnect" <no-reply@crafterconnect.com>',
        to: email,
        subject: '✅ ¡Último Paso! Verifica tu Cuenta de CrafterConnect', // Subject claro y con emoji
        
        // --- 1. Contenido de Texto Plano (para clientes sin HTML) ---
        text: `
¡Bienvenido a CrafterConnect!

¡Estás a punto de empezar! Haz clic en el siguiente enlace para verificar tu cuenta y activar tu perfil:
${link}

Si no te registraste en CrafterConnect, por favor ignora este correo de forma segura.

Atentamente,
El Equipo de CrafterConnect
        `.trim(),

        // --- 2. Contenido HTML Mejorado ---
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333333; max-width: 600px; margin: 0 auto; border: 1px solid #007bff; border-radius: 8px; overflow: hidden;">
                
                <div style="background-color: #007bff; color: #ffffff; padding: 20px; text-align: center;">
                    <h1 style="margin: 0; font-size: 24px;">Bienvenido a CrafterConnect</h1>
                </div>

                <div style="padding: 30px; border-bottom: 1px solid #eeeeee;">
                    <p style="font-size: 16px;">¡Hola!</p>

                    <p style="font-size: 16px;">Gracias por registrarte. Solo queda un paso para que tu cuenta esté activa y puedas empezar a **contratar o promocionar** servicios de oficio.</p>
                    
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 25px auto; width: 100%;">
                        <tr>
                            <td style="border-radius: 5px; background: #28a745; text-align: center; padding: 15px 0;">
                                <a href="${link}" target="_blank" style="display: block; padding: 10px 25px; font-size: 18px; font-weight: bold; color: #ffffff; text-decoration: none; border-radius: 5px;">
                                    VERIFICAR MI CUENTA AHORA
                                </a>
                            </td>
                        </tr>
                    </table>

                    <p style="font-size: 16px;">Al verificar tu cuenta, tendrás acceso completo al sistema de búsqueda, chat y gestión de perfil.</p>
                </div>

                <div style="padding: 15px; font-size: 14px; color: #6c757d; background-color: #f8f8f8;">
                    <p style="margin-top: 0; font-weight: bold;">AVISO:</p>
                    <p style="margin: 5px 0;">Si no te has registrado en CrafterConnect, por favor, ignora este mensaje. No se requiere ninguna acción de tu parte.</p>
                </div>
            </div>
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Correo de verificación enviado:', info.messageId); //  Mejor práctica
    } catch (error) {
        
        console.error('Nodemailer Error:', error);
        throw new Error('No se pudo enviar el correo de verificación.');
    }
};
//funcion para la recuperacion de contraseña
exports.sendResetPasswordEmail = async (email, link) => {
    const mailOptions = {
        from: '"CraftConnect" <no-reply@craftconnect.com>',
        to: email,
        subject: 'Recuperacion de credenciales',
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333333; max-width: 600px; margin: 0 auto; border: 1px solid #dddddd; border-radius: 8px; overflow: hidden;">
                
                <div style="background-color: #007bff; color: #ffffff; padding: 20px; text-align: center;">
                    <h1 style="margin: 0; font-size: 24px;">CraftConnect</h1>
                </div>

                <div style="padding: 30px;">
                    <p style="font-size: 16px;">Hola,</p>

                    <p style="font-size: 16px;">Hemos recibido una solicitud para restablecer la contraseña de tu cuenta.</p>
                    
                    <p style="font-size: 18px; font-weight: bold; color: #dc3545;">⚠️ ¡Solo tienes 60 minutos para usar este enlace!</p>

                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 25px auto; width: 100%;">
                        <tr>
                            <td style="border-radius: 5px; background: #dc3545; text-align: center; padding: 15px 0;">
                                <a href="${link}" target="_blank" style="display: block; padding: 10px 25px; font-size: 18px; font-weight: bold; color: #ffffff; text-decoration: none; border-radius: 5px;">
                                    CREAR NUEVA CONTRASEÑA
                                </a>
                            </td>
                        </tr>
                    </table>

                    <div style="margin-top: 30px; padding: 15px; border-top: 1px solid #eeeeee; font-size: 14px; color: #6c757d;">
                        <p style="margin-bottom: 5px;">**AVISO DE SEGURIDAD:**</p>
                        <p style="margin-top: 0;">Si tú no solicitaste este cambio, puedes ignorar este correo. Tu contraseña actual **permanecerá segura**.</p>
                        <p style="margin-top: 5px;">*Por favor, no compartas este enlace con nadie.*</p>
                    </div>
                </div>

                <div style="background-color: #f8f8f8; padding: 15px; text-align: center; font-size: 12px; color: #aaaaaa;">
                    <p>Este es un mensaje automático de CraftConnect. Por favor, no respondas a este correo.</p>
                </div>
            </div>
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Correo de recuperacion enviado', info.messageId);
    } catch (error) {
        console.error('Nodemailer Error:', error);
        throw new Error('No se pudo enviar el correo de recuperacion de contraseña');
    }
};