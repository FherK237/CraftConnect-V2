const jwt = require('jsonwebtoken');
const Conversation = require('../models/Conversation');


module.exports = function (io) {
    io.on('connection', (socket) => {
        console.log(`Cliente conectado: ${socket.id}`);

        socket.on('join_room', (userId) => {
            socket.join(userId);
            console.log(`Usuario ${userId} se unio a la sala.`);

        });

        socket.on('send_message', async (messageDataFromClient) => {
            try {

                const data = messageDataFromClient;

                const dataToSave = {
                    // ✅ Leemos desde la variable de datos (messageDataFromClient/data)
                    sender_id: data.senderId, 
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