const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

   exports.sendVerificationEmail = async (email, verificationLink) => {
    console.log("Link de verificación:", verificationLink);

    await resend.emails.send({
        from: 'CraftConnect <no-reply@resend.dev>',
        to: email,
        subject: 'Verifica tu cuenta en CraftConnect',
        html: `
            <h2>¡Hola!</h2>
            <p>Gracias por registrarte en <b>CraftConnect</b>.</p>
            <p>Por favor haz clic en el siguiente enlace para verificar tu cuenta:</p>
            <a href="${verificationLink}" target="_blank">Verificar mi cuenta</a>
            <p>Si no creaste esta cuenta, ignora este mensaje.</p>
        `,
    });
};



    module.exports = {
        sendVerificationEmail: this.sendVerificationEmail
    }