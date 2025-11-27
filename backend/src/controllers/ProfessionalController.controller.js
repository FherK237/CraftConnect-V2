const { Professional, Service, Category, ProfessionalService, ServiceImage, Schedule, Job, Portfolio, Contract, PortfolioImage, Review} = require('../models/index');
const { saveFile } = require('../utils/saveFile');
const { Op, where } = require('sequelize');
const { validationResult } = require('express-validator');
const { parse } = require('dotenv');

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
            const services = await Service.findAll({ attributes: ['id','name','description'],  where: { status: 'active' }});
            
            const servicesData = await ProfessionalService.findAll({
                where: { 
                    id: professionalService_id, 
                    service_id: service_id, 
                    professional_id: id
                },
                attributes: ['base_price', 'professional_description'],
                include: [
                    {
                        model: Service,
                        as: 'service',
                        required: true, 
                        attributes: ['id', 'name'],
                        include: [
                            {
                                model: ServiceImage,
                                as: 'service_images',
                                required: false, 
                                attributes: ['image_service', 'image_description']
                            }
                        ]
                    }
                ]
            });
            
            res.json({ categories: categories, services: services, service: servicesData });
            
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
                    const image_description = imagesData[i].description || 'Imagen sin descripción';
                    const is_main = imagesData[i].is_main || (i === 0 && !image_id);

                    let image_service = null;
                    if (file) {
                        image_service = saveFile(file, 'images_service');
                    }

                    // UPDATE o CREATE
                    if (image_id) {
                        const updateData = {
                            image_description: image_description,
                            is_main: is_main
                        };

                        if (image_service) {
                            updateData.image_service = image_service;
                        }

                        await ServiceImage.update(updateData, {
                            where: { id: image_id, service_id: service_id }
                        });

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
    // FUNCION PARA CAMBIAR Buscar Fixers por categoria, zona y calificacion        PROBAR
    //====================

exports.searchFixers = async (req, res) => {
    try {
        const { job_id, rating, clientLat, clientLon, radius = 20 } = req.query; // radio por defecto: 20 km

        let whereClause = {
            role: 'professional',
            is_verified: true, // Solo Fixers verificados
            is_available: true // Por defecto, solo disponibles
        };

        // --- 1. FILTRO POR OFICIO (job_id) ---
        if (job_id) {
            whereClause.job_id = job_id;
        }

        // --- 2. FILTRO POR CALIFICACIÓN (rating) ---
        // Se añade un filtro de JOIN para buscar Fixers con calificación mínima.
        const havingClause = {};
        if (rating) {
            havingClause['avgRating'] = { [Op.gte]: parseFloat(rating) };
        }

        // --- 3. CÁLCULO DE UBICACIÓN/DISTANCIA (Haversine) ---
        let orderClause = [['id', 'ASC']]; // Orden por defecto
        
        if (clientLat && clientLon) {
            // FÓRMULA DE HAVERSINE para calcular la distancia en KM
            const DISTANCE_CALC = Sequelize.literal(`
                (6371 * acos(
                    cos(radians(${clientLat})) * cos(radians(latitude))
                    * cos(radians(longitude) - radians(${clientLon}))
                    + sin(radians(${clientLat})) * sin(radians(latitude))
                ))
            `);

            // Añadir la distancia al resultado y filtrar por radio
            whereClause.latitude = { [Op.not]: null }; // Solo Fixers con ubicación registrada

            // Ordenar por la distancia calculada (más cercanos primero)
            orderClause = [[Sequelize.literal('distance'), 'ASC']];
            
            // Si quieres filtrar por un radio máximo:
            // whereClause[DISTANCE_CALC] = { [Op.lte]: radius };
        }

        // 4. Ejecutar la Búsqueda (Join para Calificación y Ubicación)
        const fixers = await Professional.findAll({
            attributes: {
                // Selecciona los campos públicos
                include: [
                    [Sequelize.fn('AVG', Sequelize.col('Reviews.rating')), 'avgRating'], // Calcula la calificación promedio
                    ...(clientLat && clientLon ? [[DISTANCE_CALC, 'distance']] : []), // Añade la columna 'distance' si se usan coordenadas
                ],
                exclude: ['password', 'status', 'lock_until', 'failed_attempts', 'resetToken', 'resetTokenExpiry']
            },
            where: whereClause,
            include: [{
                model: Review, // Asume que la tabla Review está correctamente asociada a Professional
                attributes: [] // No necesitamos los detalles de las reseñas, solo el AVG
            }],
            group: ['Professional.id'], // Agrupar por Fixer para calcular el promedio
            having: havingClause, // Aplicar el filtro de calificación mínima
            order: orderClause
        });

        if (!fixers || fixers.length === 0) {
            return res.status(404).json({ message: "No existen Fixers que coincidan con los criterios de búsqueda."});
        }

        return res.status(200).json({ 
            message: "Fixers encontrados con éxito.",
            results: fixers,
        });

    } catch (error) {
        console.error("Error al obtener lista de Fixers:", error);
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

    exports.getPortfolios = async(req, res) => {
        const { id } = req.user; // id del professional :)
        try {
            const portfolios = await Portfolio.findAll({ 
            where: { status: 'active'},
                include: [
                    {
                        model: Contract,
                        as: 'contract',
                        required: true,
                        include: [
                            {
                                model: Professional,
                                as: 'professional',
                                attributes: ['firstname'],
                                where: { id : id }, // busca por id de professional
                                required: true
                            }
                        ]
                    }
                ]
            });

            return res.status(201).json({ portfolios: portfolios});

        } catch (error) {
             console.error("Error al obtener la información del portfolio.", error);
                 return res.status(500).json({message: "Error del servidor al obtener informacion de los Portafolios."});
        }
    }

    exports.formRegisterPortfolio = async(req, res) => {
        try {
            const { contract_id } = req.params;

            const infoPortfolio = await Contract.findAll({
                where: { id: contract_id },
                attributes: ['id', 'end_datetime'],
                include: [
                   {
                        model: Service,
                        as: 'service',
                        attributes: ['name'],
                        required: true
                   }
                ]
            });

            res.status(201).json({ infoPortfolio: infoPortfolio, contract_id: contract_id});

        } catch (error) {
             console.error("Error al obtener la información del portfolio.", error);
                 return res.status(500).json({message: "Error del servidor al registrar Portafolio."});
        }
    }

    exports.registerPortfolio = async(req, res) => {
        try {
            //Validar campos
            const errors = validationResult(req);
                if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

            const { title, completion_date, description, contract_id, image_description } = req.body;

            if ( !title || !completion_date || !description || !contract_id ) return res.status(500).json({ message: 'Todos los campos son obligatorios'});
            if ( !req.files || req.files.length  === 0) return res.status(400).json({ message: 'No se subieron las imagenes del portafolio'});            

            const newPortfolio = await Portfolio.create({
                title: title,
                completion_date: completion_date,
                description: description,
                contract_id: contract_id
            });

            const portfolio_id = newPortfolio.id;

            const descriptions =  Array.isArray(image_description) ? image_description : [image_description];

            for (let i = 0; i < req.files.length; i++) {
                const file = req.files[i];
                const description = descriptions[i] || 'Sin descripción de Imagen';
                const image_portfolio = saveFile(file, 'images_portfolio');
                await PortfolioImage.create({
                    image_url: image_portfolio,
                    description: description,
                    is_main: (i === 0) ? true : false,
                    portfolio_id: portfolio_id
                });
            }


             res.status(200).json({ message: 'Portafolio Registrado correctamente.' });


        } catch (error) {
            console.error("Error al obtener la información del portfolio.", error);
                 return res.status(500).json({message: "Error del servidor al registrar Portafolio."});
        }
    }

    exports.formUpdatePortfolio = async(req, res) => {
        try {

            const { portfolio_id, contract_id } = req.params;

            const portfolio = await Portfolio.findAll({
                where: { id: portfolio_id, contract_id: contract_id },
                include: [
                    {
                        model: PortfolioImage,
                        as: 'portfolio_images',
                        required: true
                    }
                ]
            });

            res.json({portafolio: portfolio});


        } catch (error) {
             console.error("Error al obtener la información del portfolio.", error);
                 return res.status(500).json({message: "Error del servidor al actualizar Portafolio."});
        }
    }

    exports.updatePortfolio = async(req, res) => {
        try {
            //Validar campos
            const errors = validationResult(req);
                if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

            const { portfolio_id, contract_id } = req.params;

            const { title, completion_date, description, images_data } = req.body;

            if ( !title || !completion_date || !description || !images_data ) return res.status(500).json({ message: 'Todos los campos son obligatorios.'});

            const [portfolio] = await Portfolio.update({
                title: title,
                completion_date: completion_date,
                description: description
            }, { where: { id: portfolio_id, contract_id: contract_id }});

            if (!portfolio || (Array.isArray(portfolio) && portfolio[0] === 0)) return res.status(404).json({ message: 'El portafolio no encontrado'});                
            
            // Ejecuta esto ANTES de cualquier creación o actualización
                await PortfolioImage.update(
                    { is_main: false },
                    { where: { portfolio_id: portfolio_id } }
                );
            
            const imagesData = JSON.parse(images_data);
            

            for (let i = 0; i < imagesData.length; i++) {
                const file = req.files[i];
                const image_id = imagesData[i].image_id;
                const image_description = imagesData[i].description || 'Imagen sin descripción';
                const is_main = imagesData[i].is_main || (i === 0 && !image_id);

                let image_portfolio = null;
                
                if (file) {
                    image_portfolio = saveFile(file, 'images_portfolio');
                }
                console.log(image_portfolio);
                

                // UPDATE ó CREATE

                if (image_id) {
                    const updateData = {
                        description: image_description,
                        is_main: is_main,
                    }

                // Solo actualizar image_url si el usuario envió nueva imagen
                if (image_portfolio) {
                    updateData.image_url = image_portfolio;
                }

                await PortfolioImage.update(updateData, 
                    { where: { id: image_id, portfolio_id: portfolio_id}} 
                );

                } else if (image_portfolio) {
                   await PortfolioImage.create({
                        portfolio_id: portfolio_id,
                        image_url: image_portfolio,
                        description: image_description,
                        is_main: (i == 0) ? true : false
                   });
                }
                
            }

            res.status(200).json({message: 'Portafolio Actualizado con éxito'});

        } catch (error) {
            console.error("Error al obtener la información del portfolio.", error);
                return res.status(500).json({message: "Error del servidor al actualizar Portafolio."}); 
        }
    }

    exports.deactivatePortfolio = async(req, res) => {
        try {
            const { portfolio_id, contract_id } = req.body;

            await Portfolio.update({ status: 'deactivate'}, { where: { id: portfolio_id, contract_id: contract_id } });

            res.status(200).json({ message: 'Portafolio desactivado correctamente.'});

        } catch (error) {
            console.error("Error al obtener la información del portfolio.", error);
                return res.status(500).json({message: "Error del servidor al actualizar Portafolio."}); 
        }
    }

    module.exports = {
        formRegisterService:   this.formRegisterService,
        registerService:       this.registerService,
        formUpdateService:     this.formUpdateService,
        updateService:         this.updateService,
        deactivateService:     this.deactivateService,
        registerSchedule:      this.registerSchedule,
        Schedule:              this.Schedule,
        formUpdateSchedule:    this.formUpdateSchedule,
        updateSchedule:        this.updateSchedule,
        deactivateSchedule:    this.deactivateSchedule,
        SwitchAvailable:       this.SwitchAvailable,
        getJobTittles:         this.getJobTittles,
        searchFixers:          this.searchFixers,
        getFixerProfilePublic: this.getFixerProfilePublic,
        getPortfolios:         this.getPortfolios,
        registerPortfolio:     this.registerPortfolio,
        formRegisterPortfolio: this.formRegisterPortfolio,
        formUpdatePortfolio:   this.formUpdatePortfolio,
        updatePortfolio:       this.updatePortfolio,
        deactivatePortfolio:   this.deactivatePortfolio
    };
