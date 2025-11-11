// En tu archivo de utilidades/configuración de Nodemailer

const transporter = require('../config/nodemailerConfig') // Tu transporter configurado

// La función debe recibir el correo del usuario y el enlace completo
exports.sendVerificationEmail = async (email, link) => {
    const mailOptions = {
        from: '"CrafterConnect" <no-reply@crafterconnect.com>',
        to: email,
        subject: 'Activa tu cuenta de CrafterConnect',
        html: `
            <p>¡Hola! Haz clic en el siguiente enlace para verificar tu cuenta de CrafterConnect:</p>
            <a href="${link}" style="padding: 10px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
                Verificar mi Cuenta
            </a>
            <p>Si no te registraste, puedes ignorar este correo.</p>
        `,
        text: `¡Hola! Haz clic en el siguiente enlace para verificar tu cuenta de CrafterConnect: ${link} \nSi no te registraste, puedes ignorar este correo.`,
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
        from: '"CrafterConnect" <no-reply@crafterconnect.com>',
        to: email,
        subject: 'Recuperacion de credenciales',
        html: `
            <p>Hola,</p>
            <p>Hemos recibido una solicitud para **restablecer la contraseña** de tu cuenta de **CrafterConnect**.</p>
            <p>Para crear una nueva contraseña, haz clic en el siguiente botón. **Este enlace es válido solo por 1 hora**.</p>
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: auto;">
                <tr>
                    <td style="border-radius: 5px; background: #dc3545; text-align: center;">
                        <a href="${link}" style="display: block; padding: 10px 20px; font-size: 15px; font-weight: bold; color: #ffffff; text-decoration: none; border-radius: 5px;">
                            Restablecer Contraseña
                        </a>
                    </td>
                </tr>
            </table>
            <p style="margin-top: 20px; font-size: 13px; color: #6c757d;">Si no solicitaste un restablecimiento de contraseña, por favor ignora este correo. Tu contraseña actual permanecerá sin cambios.</p>
            <p style="font-size: 13px; color: #6c757d;">**No compartas este enlace con nadie.**</p>`
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Correo de recuperacion enviado', info.messageId);
    } catch (error) {
        console.error('Nodemailer Error:', error);
        throw new Error('No se pudo enviar el correo de recuperacion de contraseña');
    }
};