const { Professional, Service, Category, ProfessionalService, ServiceImage, Schedule, Job } = require('../models/index');
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

exports.SwitchAvailable = async (req, res) => {        
    try {
        console.log("Actualizar disponibilidad de Fixer.")
        const fixer = req.user;
        const { is_available } = req.body;

        if (fixer.role !== 'professional') {
            return res.status(403).json({ message: 'Acceso denegado. Solo Fixers pueden ver esta ruta.' });
        }

        fixer.is_available = is_available;
        await fixer.save();

        const statusText = is_available ? 'DISPONIBLE' : 'OCUPADO';

        return res.status(200).json({ 
            message: `Estado de disponibilidad actualizado con exito: ${statusText}.`,
            is_available: fixer.is_available
        });
    } catch (error) {
        console.error('Error al actualizar el estado de disponibilidad.', error);
        return res.status(401).json({ message: 'Error interno del servidor al actualizar disponibilidad.'});
    }
};

//====================
// FUNCION GET OBTENER LISTA DE OFICIOS
//====================

exports.getJobTittles = async (req, res) => {
    try {
        console.log( {message: 'Lista de oficios.'});

        const jobs = await Job.findAll({
            attributes: ['id', 'title', 'description']
        });

        if (!jobs || !jobs.length === 0 ){
            return res.status(404).json({ message:" La lista de oficios esta vacia." });
        }

        return res.status(200).json({ message: "Lista de categorias obtenida con exito.",
            jobs: jobs
        });


    } catch (error) {
        console.error({ message: 'Error al obtener la lista de oficios.', error});
        return res.status(500).json({ message: "Error interno al obtener oficios."});
    }
};

//====================
// FUNCION PARA CAMBIAR Buscar Fixers por categoria
//====================

exports.searchFixers = async (req, res) => {
    try {
        console.log("Busqueda de Fixers con filtros.");
        const { job_id, is_available } = req.query;

        let soloFixers = {
            role: 'professional',
        };

        if (job_id) {
            soloFixers.job_id = job_id;
        }

        const fixers = await Professional.findAll({
            where: soloFixers,
            attributes: ['id', 'firstname', 'lastname', 'description', 'job_id', 'is_available', 'picture', 'experience_years']
        });

        if (!fixers || fixers.length === 0 ) {
            return res.status(404).json({ message: "No existen ningun Fixer con esos filtros"});
        }

        return res.status(201).json({ 
            message: "Fixers encontrados con exito.",
            results: fixers,
        });
    } catch (error) {
        console.error("Error al obtener lista de Fixers");
        return res.status(500).json({ message: "Error en el servidor al obtener Fixers."})
    }
};

exports.getFixerProfilePublic = async (req, res) => {
    try {
        console.log("Visualizar el perfil de un Fixer en especifico.");

        const fixerId = req.params.id;

        const fixerProfile =  await Professional.findByPk( fixerId, {
            attributes: {
                exclude: ['password', 'failedAttempts', 'lockUntil', 'verification_token', 'image_ine_front', 'image_ine_back', 'resetToken', 'resetTokenExpiry', 'role', 'status']
            }
        });

        if (!fixerProfile) {
            return res.status(404).json({ message: "Fixer no encontrado."});
        }

        return res.status(200).json({ 
            message: "Obteniendo informacion de Fixer.",
            profile: fixerProfile
        });

    } catch (error) {
        console.error("Error al obtener la información del fixer.", error);
        return res.status(500).json({message: "Error del servidor al obtener informacion de fixer."});
    }
};

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
        deactivateSchedule: this.deactivateSchedule,
        SwitchAvailable: this.SwitchAvailable,
        getJobTittles: this.getJobTittles,
        searchFixers: this.searchFixers,
        getFixerProfilePublic: this.getFixerProfilePublic
    };