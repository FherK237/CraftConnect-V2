const { Contract, User, Comission, Service, Professional } = require('../models/index');
const { validationResult } = require('express-validator');

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
                    attributes: ['total_amount', 'commission', 'status']
                }]
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
module.exports = {
    createContract: this.createContract,
    confirmContract: this.confirmContract,
    completeContract: this.completeContract,
    editContract: this.editContract,
    viewContract: this.viewContract
};