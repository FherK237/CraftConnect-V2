const { Professional, Service, Category, ProfessionalService, ServiceImage, Schedule } = require('../models/index');
const { saveFile } = require('../utils/saveFile');
const { Op } = require('sequelize');
const { validationResult } = require('express-validator');

    exports.formRegisterService = async(req, res) => {
        try {
            const categories = await Category.findAll({ where: { status: 'active' }});
            const services = await Service.findAll({ where: { status: 'active' }});
            res.json({categories: categories, services: services});
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: error.message });
        }
    }

    exports.registerService = async(req, res) => {
        try {
            //Validar campos
            const errors = validationResult(req);
                if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

            const { id } = req.user;
            const { service_id, base_price, professional_description, image_description } = req.body;

            if ( !service_id || !base_price || !professional_description ) return res.status(500).json({message: 'Todos los campos son obligaotorios'});
            if ( !req.files || req.files.length  === 0) return res.status(400).json({ message: 'No se subieron las imagenes del servicio'});            

            await ProfessionalService.create({
                base_price: base_price,
                professional_description: professional_description,
                professional_id: id,
                service_id: service_id
            });

            const descriptions = Array.isArray(image_description) ? image_description : [image_description];
            
            for (let i = 0; i < req.files.length; i++) {
                const file = req.files[i];
                const description = descriptions[i] || 'Sin descripción de Imagen';
                const image_service = saveFile(file, 'images_service');
                await ServiceImage.create({
                    image_service: image_service,
                    image_description: description,
                    is_main: (i === 0) ? true : false, // La primera posicion del arreglo va ser la imagen principal
                    service_id: service_id
                });
            }

            res.status(201).json({ message: 'Servicio Registrado correctamente.' });

        } catch (error) {
            console.log(error);
            res.status(400).json({ message: error.message });
        }
    }


    exports.formUpdateService = async(req, res) => {
        try {
            const { id } = req.user;
            const { service_id, professionalService_id } = req.params;

            const categories = await Category.findAll({ attributes: ['id','title','description'], where: { status: 'active' }});
            const services = await Service.findAll({ attributes: ['id','name','description'],  where: { id: service_id, status: 'active' }});
            const service_images = await ServiceImage.findAll({ 
                attributes: ['id','image_service', 'is_main', 'image_description'],
                where: { service_id: service_id}
            });

            const profesionalService = await ProfessionalService.findAll({
                attributes: ['base_price', 'professional_description'],
                where: { id: professionalService_id, service_id: service_id, professional_id: id}
            });
            
            res.json({ categories: categories, services: services, profesionalService: profesionalService, service_images: service_images });
            
            res.json('holap soy el formulario de actualizar');

        } catch (error) {
            console.log(error);
            res.status(400).json({ message: error.message });
        }
    }

    exports.updateService = async(req, res) => {
        try {
            //Validar campos
            const errors = validationResult(req);
                if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

            const { service_id, professionalService_id } = req.params;
            const { id } = req.user;
            const { service, base_price, professional_description, images_data} = req.body;

            if (!service || !base_price || !professional_description || !images_data) return res.status(500).json({ message: 'Todos los campos son obligatorios.'});

            const profesionalService = await ProfessionalService.update({
                base_price: base_price,
                professional_description: professional_description,
                service_id: service,
            }, { where: { id: professionalService_id, service_id: service_id, professional_id: id }});

            if (!profesionalService || (Array.isArray(profesionalService) && profesionalService[0] === 0)) return res.status(404).json({ message: 'El servicio del professional no encontrado'});                

            const imagesData = JSON.parse(images_data);
            // Ejecuta esto ANTES de cualquier creación o actualización
                await ServiceImage.update(
                    { is_main: false },
                    { where: { service_id: service_id } }
                );
            
                for (let i = 0; i < imagesData.length; i++) {
                    const file = req.files[i];
                    const image_id = imagesData[i].image_id;
                    const image_description = imagesData[i].caption || '';
                    const is_main = imagesData[i].is_main || (i === 0 && !image_id);

                    let image_service = null;
                    if (file) {
                        image_service = saveFile(file, 'images_service');
                    }

                    // UPDATE o CREATE
                    if (image_id) {
                        await ServiceImage.update({
                            image_service: image_service,
                            image_description: image_description,
                            is_main: is_main
                        }, { where: { service_id: service_id, id: image_id }});
                    } else if (image_service) {
                        await ServiceImage.create({
                            service_id: service_id,
                            image_service: image_service, 
                            image_description: image_description,
                            is_main: (i === 0) ? true : false,
                        });
                    }
                    
                }

                res.status(200).json({ message: 'Servicio actualizado con éxito.' });

            
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: error.message });
        }
    }

    exports.deactivateService = async(req, res) => {
        try {
             //Validar campos
            const errors = validationResult(req);
                if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

            const { service_id, professionalService_id } = req.params;
            const { id } = req.user;

            const [rowsUpdated] = await ProfessionalService.update(
                {status: 'inactive'}, 
                    {where: { id: professionalService_id, service_id: service_id, professional_id: id }
            });

            if (rowsUpdated === 0) {
                // Si no se actualizó ninguna fila, puede ser que el ID no exista o el usuario no sea el dueño.
                return res.status(404).json({ message: 'Servicio no encontrado o no autorizado para la desactivación.' });
            }
            
            res.status(200).json({ message: 'Servicio Desactivado con éxito.' });

        } catch (error) {
            console.log(error);
            res.status(400).json({ message: error.message });   
        }
    }

    exports.registerSchedule = async(req, res) => {
        try {
            //Validar campos
            const errors = validationResult(req);
                if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
                
            const { day_of_week, start_time, end_time } = req.body;
            const { id } = req.user;

            if ( !day_of_week || !start_time || !end_time ) return res.status(500).json({ message: 'Todos los campos son obligatorios'})

            const overlapping = await Schedule.findOne({
                where: {
                    professional_id: id,
                    day_of_week: day_of_week,
                    status: 'available',
                    [Op.or]: [
                        { start_time: { [Op.between]: [start_time, end_time] } },
                        { end_time: { [Op.between]: [start_time, end_time] } },
                    ],
                },
            });

            if (overlapping) return res.status(400).json({ message: 'Ya tienes un horario que se cruza con este rango.'});

            if (start_time >= end_time) return res.status(400).json({ message: 'La hora de inicio debe ser menor que la hora de fin.' });
            
            await Schedule.create({
                day_of_week: day_of_week,
                start_time: start_time,
                end_time: end_time,
                professional_id: id
            });

            res.status(200).json({ message: 'Horario Registrado correctamente.'})

        } catch (error) {
            console.log(error);
            res.status(400).json({ message: error.message });   
        }
    }

    exports.Schedule = async(req, res) => {
        try {
            const { id } = req.user;
            const schedules = await Schedule.findAll({ where: { professional_id: id, status: 'available' }});
            res.json({ schedules: schedules });

        } catch (error) {
            console.log(error);
            res.status(400).json({ message: error.message });   
        }
    }

    exports.formUpdateSchedule = async(req, res) => {
        try {
            const { schedule_id } = req.params; 
            const { id } = req.user;
            
            const schedule = await Schedule.findAll({ where: { id: schedule_id, professional_id: id }});
            
            res.json({ schedule: schedule });

        } catch (error) {
            console.log(error);
            res.status(400).json({ message: error.message });
        }
    }

    exports.updateSchedule = async(req, res) => {
        try {
            //Validar campos
            const errors = validationResult(req);
                if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
                
            const { schedule_id } = req.params;
            const { id } = req.user;
            const { day_of_week, start_time, end_time } = req.body;

            const overlapping = await Schedule.findOne({
                where: {
                    professional_id: id,
                    day_of_week: day_of_week,
                    id: { [Op.ne]: schedule_id },
                    status: 'available',
                    [Op.or]: [
                    { start_time: { [Op.between]: [start_time, end_time] } },
                    { end_time: { [Op.between]: [start_time, end_time] } },
                    {
                        [Op.and]: [
                        { start_time: { [Op.lte]: start_time } },
                        { end_time: { [Op.gte]: end_time } },
                        ],
                    },
                    ],
                },
                });

            if (overlapping) return res.status(400).json({ message: 'Ya tienes un horario que se cruza con este rango.'});

            if (start_time >= end_time) return res.status(400).json({ message: 'La hora de inicio debe ser menor que la hora de fin.' });
                
                
            await Schedule.update({
                day_of_week: day_of_week,
                start_time: start_time,
                end_time: end_time
            }, { where: { id: schedule_id, professional_id: id}});

             res.status(200).json({ message: 'Horario Actualizado correctamente.'})

        } catch (error) {
            console.log(error);
            res.status(400).json({ message: error.message });
        }
    }

    exports.deactivateSchedule = async(req, res) => {
        try {
            const { id } = req.user;
            const { schedule_id } = req.params;

            await Schedule.update({ status: 'unavailable'}, { where: { id: schedule_id, professional_id: id } });

            res.status(200).json({ message: 'Horario desactivado correctamente.'});
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: error.message });
        }
    }

    exports.createContract = async(req, res) => {

    }

    module.exports = {
        formRegisterService: this.formRegisterService,
        registerService:     this.registerService,
        formUpdateService:   this.formUpdateService,
        updateService:       this.updateService,
        deactivateService:   this.deactivateService,
        registerSchedule:    this.registerSchedule,
        Schedule:            this.Schedule,
        formUpdateSchedule:  this.formUpdateSchedule,
        updateSchedule: this.updateSchedule,
        deactivateSchedule: this.deactivateSchedule
    };