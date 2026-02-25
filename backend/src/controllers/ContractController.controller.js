const { Contract, User, Conversation, Comission, Service, Professional, Review } = require('../models/index');
const { validationResult } = require('express-validator');
const pdf = require('html-pdf')
const getContractHtml = require('../utils/pdfTemplates')
const { Op } = require('sequelize');
const Sequelize = require('sequelize');

exports.createContract = async (req, res) => {
    try {
        const fixer = req.user;

        // 1. Validar Rol
        if (fixer.role !== "professional") {
            return res.status(403).json({ message: 'Acceso denegado, solo fixers pueden crear contratos.'});
        }

        // 2. Desestructurar los datos de la propuesta
        const { client_id, total_price, service_id, start_datetime, end_datetime } = req.body;


        // 3. Validación Mínima de Campos Requeridos
        if ( !client_id || !total_price || !service_id|| !start_datetime ) {
            return res.status(400).json({ message: 'Faltan campos obligatorios.'});
        }

        // 4. Conversión y Validación Numérica
        const price = parseFloat(total_price);
        if (isNaN(price) || price <= 0) { 
            return res.status(400).json({ message: 'El precio total (total_price) debe ser un número positivo válido.' });
        }

        // 5. Verificar Servicio: Asegurar que el service_id existe en la tabla 'services
        const service = await Service.findByPk(service_id);
        if (!service) {
            return res.status(404).json({ message: 'El ID de servicio proporcionado no es válido.'});
        }

        // 6. Verificación del Cliente en la DB
        const clientExists = await User.findByPk(client_id);
        if (!clientExists) {
            return res.status(400).json({ message: 'Cliente con el ID no fue encontrado.'});
        }

        // 7. CÁLCULO DE COMISIÓN (Usando la variable 'price' validada)
        const comissionRate = 0.15;
        const commissionAmount = price * comissionRate;

        // 8. Crear la entrada en la tabla commissions
        const newCommision = await Comission.create({
            total_amount: price,
            commission: commissionAmount,
            status: 'pending'
        });

        // 9. Crear la entrada en la tabla contracts
        const newContract = await Contract.create({
            user_id: client_id,
            professional_id: fixer.id, // ID del Fixer logueado
            commission_id: newCommision.id,
            price: price,
            service_id: service_id,
            start_datetime: new Date(start_datetime),
            end_datetime: end_datetime ? new Date(end_datetime) : null,
            status: 'pending' // Estado inicial
        });

        return res.status(201).json({
            message: 'Propuesta de contrato creada con éxito. Esperando la confirmación del cliente.',
            contract: newContract,
            comission: newCommision
        });

    } catch (error) {
        console.error('Error al crear propuesta del contrato.', error);
        return res.status(500).json({ message: 'Error en el servidor al crear contrato.',
            details: error.message
        });
    }
};

exports.confirmContract = async ( req, res ) => {
    try {
        const client = req.user;
        const contractId = req.params.contractId;

        // 1. Buscar contrato
        const contract = await Contract.findByPk(contractId);

        if (!contract) {
            return res.status(404).json({ message: 'Contrato no encontrado.'});
        }

        //2. Validacion de propiedad
        // Solo el cliente asociado puede confirmar el contrato
        if (contract.user_id !== client.id) {
            return res.status(403).json({ message: 'Acceso denegado. Solo el cliente puede confirmar el contrato.'});
        }

        // 3. Validacion del estado actual
        if (contract.status !== 'pending') {
            return res.status(400).json({ message: `El contrato ya esta en estado ${contract.status}. Solo se pueden confirmar contratos pendientes.`});
        }

        // 4. Actualizar estado (Aceptar contrato)
        const [updatedRows] = await Contract.update(
            { status: 'confirmed'},
            { where: { id: contractId } }
        );

        if (updatedRows === 0 ) {
            return res.status(500).json({ message: 'No se pudo actualizar el estado del contrato.'});
        }

        // 5. Devolver el contrato actualziado
        // Se vuelve a buscar para tener el objeto actualizado y completo

        const updatedContract = await Contract.findByPk(contractId);

        return res.status(200).json({ message: 'Contrato confirmado y aceptado con éxito.',
            contract: updatedContract
        });

    } catch (error) {
        console.error('Error al enviar la confirmación del contrato.', error);
        return res.status(500).json({ message: 'Error en el servidor al procesar la confirmación.'});
    }
};

exports.completeContract = async (req, res) => {
    try {
        const fixer = req.user;
        const contractId = req.params.contractId;

        // 1. Validar Rol
        if (fixer.role !== "professional") {
            return res.status(403).json({ message: 'Acceso denegado, solo fixers pueden completar contratos.'});
        }

        // 2. Buscar contrato
        const contract = await Contract.findByPk(contractId);

        if (!contract) {
            return res.status(404).json({ message: 'Contrato no encontrado.'});
        }

        // 3. Solo el Fixer dueño del contrato puede marcarlo como completado.
        if (contract.professional_id !== fixer.id ) {
            return res.status(403).json({ message: 'No tienes permiso para finalizar este contrato'})
        }

        // 4. Validacion del estado actual
        if (contract.status !== 'confirmed') {
            return res.status(400).json({ message: `Solo se pueden finalizar contratos CONFIRMADOS. Estado actual: ${contract.status}`});
        }

        // 5. Actualizar estado (completar contrato) Solo se puede completar si el estado actual es 'confirmed'
        const [updatedRows] = await Contract.update(
            { status: 'completed'},
            { where: { id: contractId } }
        );

        if (updatedRows === 0 ) {
            return res.status(500).json({ message: 'No se pudo actualizar el estado del contrato.'});
        }

        // 6. Devolver el contrato actualizado
        // Se vuelve a buscar para tener el objeto actualizado y completo
        const updatedContract = await Contract.findByPk(contractId);

        return res.status(200).json({ 
            message: 'Contrato completado/finalizado con éxito.El cliente ya puede dejar una evaluación.',
            contract: updatedContract
        });


    } catch (error) {
        console.error('Error al completar/finalizar contrato:', error);
        return res.status(500).json({ message: 'Error en el servidor al completar/finalizar contrato'})
    }
};

    exports.editContract = async (req, res) => {
        try {
            
            const fixer = req.user;
            const contractId = req.params.contractId;

            // 1. Validar Rol
            if (fixer.role !== "professional") {
                return res.status(403).json({ message: 'Acceso denegado, solo fixers pueden completar contratos.'});
            }

            // 2. Desestructurar los datos de la propuesta
            const { total_price, service_id, start_datetime, end_datetime } = req.body;

            // 2. Buscar contrato
            const contract = await Contract.findByPk(contractId);

            if (!contract) {
                return res.status(404).json({ message: 'Contrato no encontrado.'});
            }

            // 3. Solo el Fixer dueño del contrato puede editar el contrato.
            if (contract.professional_id !== fixer.id ) {
                return res.status(403).json({ message: 'No tienes permiso para editar este contrato'})
            }

            if (contract.status !== 'pending') {
                return res.status(400).json({ message: `Solo se pueden editar contratos PENDIENTES. Estado actual de este contrato: ${contract.status}.`})
            }


            let commissionId = contract.commission_id;
            let priceValue = contract.price;

            if (total_price) {
                priceValue = parseFloat(total_price);
                if (isNaN(priceValue) || priceValue <= 0 ) {
                    return res.status(400).json({ message: 'El precio debe ser un numero positivo valido.'});
                }

                const commissionRate = 0.15;
                const commissionAmount = priceValue * commissionRate;

                await Comission.update({
                    total_amount: priceValue,
                    commission: commissionAmount
                }, { where: { id: commissionId } });
            }

            // 5. Actualizar estado (completar contrato) Solo se puede completar si el estado actual es 'confirmed'
            const [updatedRows] = await Contract.update(
                { 
                    price: priceValue,
                    start_datetime: start_datetime ? new Date(start_datetime) : contract.start_datetime,
                    end_datetime: end_datetime ? new Date(end_datetime) : contract.end_datetime,
                    service_id: service_id || contract.service_id
                },
                { 
                    where: { id: contractId }
                }
            ); 

            if (updatedRows === 0 ) {
            return res.status(500).json({ message: 'No se pudo actualizar el estado del contrato.'});
            }

            // 6. Devolver el contrato actualizado
            // Se vuelve a buscar para tener el objeto actualizado y completo
            const updatedContract = await Contract.findByPk(contractId);

            return res.status(200).json({ 
                message: 'Contrato actualizado con éxito. Esperando a que el cliente confirme.',
                contract: updatedContract
            });

        } catch (error) {
            console.error('Error al actualizar datos del contrato: ', error);
            return res.status(500).json({ message: 'Error en el servidor al actualizar datos del contrato.'});
        }
    };

    exports.viewContract = async (req, res) => {
        try {
            const currentUser = req.user;
            const contractId = req.params.contractId;

            const contract = await Contract.findByPk(contractId, {
                include: [{
                    model: Comission,
                    attributes: ['total_amount', 'commission', 'status'],
                    as: 'Comission'
                },
                // ✅ Incluir Fixer y Cliente con sus aliases para completar la vista de datos
                { model: User, attributes: ['firstname', 'lastname'], as: 'user'},
                { model: Professional, attributes: ['firstname', 'lastname'], as: 'professional'}
                ]
            });

            if (!contract) {
                return res.status(404).json({ message: 'Contrato no encontrado'});
            }

            //Verificación de ropiedad
            const isOwner = contract.professional_id === currentUser.id && currentUser.role === 'professional';
            const isClient = contract.client_id === currentUser.id && currentUser.role === 'user';

            if (!isOwner && !isClient) {
                return res.status(403).json({ message: 'Acceso denegado. No eres parte de este contrato.'});
            }

            //Respuesta exitosa
            return res.status(200).json({
                message: 'Contrato consultado con exito.',
                contract: contract
            })

            

        } catch (error) {
            console.error('Error al visualizar contrato: ', error);
            return res.status(500).json({ message: 'Error en el servidor al obtener contrato.'});
        }
    }

    exports.getChatHistory = async (req, res) => {
        try {
            const currentUser = req.user;
            let userId = currentUser.id;
            // Identificamos exactamente quién soy yo en la base de datos
            const userType = currentUser.role === 'user' ? 'user' : 'professional';
            
            if (userType === 'professional') {
                // Nota: Verifica si tu columna en la BD se llama 'user_id' o 'userId'
                const prof = await Professional.findOne({ where: { user_id: currentUser.id } });
                if (prof) {
                    userId = prof.id; 
                }
            }

            const { partnerId } = req.params; 
    
            // Si yo soy cliente, hablo con un fixer. Y viceversa.
            const partnerType = userType === 'user' ? 'professional' : 'user';
    
            // Validar que partnerId exista
            if (!partnerId) {
                return res.status(400).json({ message: 'Falta el ID del participante.' });
            }
    
            // Buscar todos los mensajes EXACTOS entre Tú y el Partner
            const messages = await Conversation.findAll({
                where: {
                    [Op.or]: [
                        // Mensajes que YO envié al OTRO (Validando IDs y Tipos)
                        { 
                            sender_id: userId, 
                            sender_type: userType,
                            receiver_id: partnerId,
                            receiver_type: partnerType
                        },
                        // Mensajes que el OTRO me envió a MÍ (Validando IDs y Tipos)
                        { 
                            sender_id: partnerId, 
                            sender_type: partnerType,
                            receiver_id: userId, 
                            receiver_type: userType
                        }
                    ]
                },
                // Ordenar del más viejo al más nuevo para que se lean de arriba hacia abajo
                order: [['created_at', 'ASC']] 
            });
    
            return res.status(200).json({
                message: 'Historial recuperado con éxito.',
                chatHistory: messages
            });
    
        } catch (error) {
            console.error('Error al obtener historial:', error);
            return res.status(500).json({ message: 'Error al cargar los mensajes.' });
        }
    };

    exports.getConversationList = async (req, res) => {
    try {
        const currentUser = req.user; // Fixer o Cliente logueado
        let userId = currentUser.id;
        const userType = currentUser.role === 'user' ? 'user' : 'professional';

        if (userType === 'professional') {
            // Nota: Verifica si tu columna en la BD se llama 'user_id' o 'userId'
            const prof = await Professional.findOne({ where: { user_id: currentUser.id } });
            if (prof) {
                userId = prof.id; 
            }
        }

        // 1. Encontrar todos los IDs de usuarios con los que este usuario ha chateado.
        // Se buscan las conversaciones donde el usuario logueado es el remitente O el receptor.
        const conversationPartners = await Conversation.findAll({
            attributes: [
                // Agrupamos por el ID del "otro" participante para obtener la lista de chats únicos
                [
                    Sequelize.literal(`CASE 
                        WHEN sender_id = ${userId} AND sender_type = '${userType}' THEN receiver_id 
                        ELSE sender_id 
                    END`), 
                    'partnerId'
                ],
                [
                    Sequelize.literal(`CASE 
                        WHEN sender_id = ${userId} AND sender_type = '${userType}' THEN receiver_type 
                        ELSE sender_type 
                    END`), 
                    'partnerType'
                ],
                // Encontrar la fecha del último mensaje
                [Sequelize.fn('MAX', Sequelize.col('created_at')), 'lastMessageAt']
            ],
            where: {
                [Op.or]: [
                    { sender_id: userId, sender_type: userType },
                    { receiver_id: userId, receiver_type: userType }
                ]
            },
            group: ['partnerId', 'partnerType'],
            order: [[Sequelize.literal('lastMessageAt'), 'DESC']] // Mostrar los más recientes primero
        });

        const partners = conversationPartners.map(p => ({
            id: p.getDataValue('partnerId'),
            type: p.getDataValue('partnerType'),
            //enviar la fecha del ultimo mensaje para que lo muestre react
            lastMessageAt: p.getDataValue('lastMessageAt')
        }))
        // buscar nombre y foto de cada contacto

        const conversacionesConDetalles = await Promise.all(
            partners.map(async (partner) => {
                let detalles = null

                if (partner.type === 'professional') {
                    detalles = await Professional.findByPk(partner.id, {
                        attributes: ['firstname', 'lastname', 'picture']
                    })
                } else {
                    detalles = await User.findByPk(partner.id, {
                        attributes: ['firstname', 'lastname', 'picture']
                    })
                }

                if (!detalles) return null
                

                return {
                    id: partner.id,
                    type: partner.type,
                    name: `${detalles.firstname} ${detalles.lastname}`,
                    picture: detalles.picture,
                    lastMessageAt: partner.lastMessageAt
                }
            })
        )

        const conversacionesLimpias = conversacionesConDetalles.filter(c => c !== null)

        return res.status(200).json({
            message: 'Lista de convesaciciones obtenida con exito',
            conversations: conversacionesLimpias,
        })
    } catch (error) {
        console.error('Error al obtener lista de conversaciones:', error);
        return res.status(500).json({ message: 'Error interno al obtener la lista de chats.' });
    }
};


exports.registerReview = async (req, res) => {
    try {
        const client = req.user; // El cliente logueado que envía la reseña
        const { contract_id, rating, comment } = req.body;

        // 1. Validar Campos Requeridos
        if (!contract_id || !rating || !comment) {
            return res.status(400).json({ message: 'Faltan campos obligatorios: ID del contrato, calificación y comentario.' });
        }
        
        // Asumiendo que has aplicado validaciones de Express-Validator en la ruta
        // para asegurar que rating es un número entero entre 1 y 5, y el comentario no está vacío.

        // 2. Buscar el Contrato
        const contract = await Contract.findByPk(contract_id);

        if (!contract) {
            return res.status(404).json({ message: 'Contrato no encontrado.' });
        }
        
        // 3. Validación de Propiedad: Solo el Cliente dueño puede calificar
        if (contract.user_id !== client.id || client.role !== 'user') {
            return res.status(403).json({ message: 'Acceso denegado. Solo el cliente dueño de este contrato puede dejar una reseña.' });
        }

        // 4. Validación de Estado: Solo se puede reseñar un trabajo completado
        if (contract.status !== 'completed') {
            return res.status(400).json({ message: `Solo se pueden dejar reseñas en contratos finalizados. Estado actual: ${contract.status}.` });
        }
        
        // 5. Validación de Reseña Única: Verificar si el contrato ya fue reseñado
        const existingReview = await Review.findOne({ where: { contract_id: contract_id } });
        if (existingReview) {
            return res.status(400).json({ message: 'Este contrato ya ha sido calificado previamente.' });
        }

        // 6. Crear la Reseña
        const newReview = await Review.create({
            contract_id: contract_id,
            rating: rating,
            comment: comment
        });

        return res.status(201).json({
            message: '¡Gracias! Reseña registrada con éxito.',
            review: newReview
        });

    } catch (error) {
        console.error('Error al registrar la reseña:', error);
        return res.status(500).json({ message: 'Error interno del servidor al procesar la reseña.' });
    }
};

exports.generateContractPDF = async (req, res) => {
    try{
        const currentUser = req.user;
        const contractId =  req.params.contractId;

        // Obtener el contrato con JOINs (Necesitamos nombre de fixer/ cliente.)
        const contract = await Contract.findByPk(contractId, {
            include: [
                { model: Comission, attributes: ['total_amount', 'commission', 'status'], as: 'Comission'},
                // Asociacion a user y professional para obtener los nombres
                { model: User, attributes: ['firstname', 'lastname'], as: 'user'},
                { model: Professional, attributes: ['firstname', 'lastname'], as: 'professional'}
            ]
        });

        if (!contract) {
            return res.status(404).json({ message: 'Contrato no encontrado.'})
        }

        // Verificar que el ususario logeado sea parte del contrato.
        if(contract.professional_id !== currentUser.id && contract.user_id !== currentUser.id) {
            return res.status(403).json({ message: 'Acceso denegado. No eres parte de este contrato.'})
        }

        // Generar HTML
        const fixerName = `${contract.professional.firstname} ${contract.professional.lastname}`;
        const clientName = `${contract.user.firstname} ${contract.user.lastname}`;

        const htmlContent = getContractHtml(contract.toJSON(), fixerName, clientName );

        //configuracion del PDF y conversion
        const options = {
            format: "Letter",
            orientation: "portrait"
        };

        pdf.create(htmlContent, options).toBuffer((err, buffer) => {
            if (err) {
                console.error('Error al creaf PDF', err)
                return res.status(500).json({ message: 'Error al generar archivo PDF.'})
            }

            //Enviar el PDF como descarga
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=Contrato-${contractId}.pdf`);
            res.send(buffer);
        });
    } catch (error) {
        console.error('Error general al generar PDF:', error);
        return res.status(500).json({ message: 'Error interno del servidor.' });
    }
}

module.exports = {
    createContract: this.createContract,
    confirmContract: this.confirmContract,
    completeContract: this.completeContract,
    editContract: this.editContract,
    viewContract: this.viewContract,
    getConversationList: this.getConversationList,
    registerReview: this.registerReview,
    generateContractPDF: this.generateContractPDF,
    getChatHistory: this.getChatHistory

};