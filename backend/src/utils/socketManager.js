const jwt = require('jsonwebtoken');
const Conversation = require('../models/Conversation');
const { Professional} = require('../models/index');



module.exports = function (io) {
    io.on('connection', (socket) => {
        console.log(`Cliente conectado: ${socket.id}`);

        socket.on('join_room', async (userId) => {
            socket.join(userId); // Se une a su sala de Usuario (ej. 40)
            
            // Si tiene perfil de Fixer, lo unimos TAMBIÉN a la sala de su perfil (ej. 27)
            // Así escuchará los mensajes que le envíen los clientes a su perfil.
            try {
                const prof = await Professional.findOne({ where: { user_id: userId } });
                if (prof) {
                    socket.join(prof.id);
                }
            } catch(e) { console.error(e) }
        });

        socket.on('send_message', async (messageDataFromClient) => {
            try {

                const data = messageDataFromClient;
                let realSenderId = data.senderId;

                // Si el que responde es el Fixer, disfrazamos su ID de Usuario por su ID de Perfil
                if (data.senderType === 'professional') {
                    const prof = await Professional.findOne({ where: { user_id: data.senderId } });
                    if (prof) realSenderId = prof.id;
                }

                const dataToSave = {
                    sender_id: realSenderId, // Usamos el ID traducido
                    receiver_id: data.receiverId,
                    sender_type: data.senderType,
                    receiver_type: data.receiverType,
                    message: data.message
                };

                // 2. Comprobar que los campos críticos no son nulos ANTES de llamar a Sequelize
                if (!dataToSave.sender_id || !dataToSave.receiver_id || !dataToSave.message) {
                    console.error("DEBUG: Datos de mensaje incompletos:", dataToSave);
                    socket.emit('message_error', { message: 'Faltan IDs o el contenido del mensaje.' });
                    return; 
                }

                // 3. Guardar el mensaje en la base de datos
                const savedMessage = await Conversation.create(dataToSave);

                // 4. Transmitir el mensaje (usamos data.receiverId del JSON original)
                io.to(data.receiverId).emit('receive_message', savedMessage);
                io.to(data.senderId).emit('receive_message', savedMessage);

            } catch (error) {
                console.error("Error al manejar mensaje (Sequelize Falló):", error);
                socket.emit('message_error', { message: 'Error interno al guardar el mensaje. Revise DB.' });
            }
        });

        socket.on('disconnect', () => {
            console.log(`Cliente desconectado: ${socket.id}`);
        });
    });
};