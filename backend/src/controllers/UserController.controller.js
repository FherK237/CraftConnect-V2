const { Job, Professional, Category, Review, Sequelize} = require('../models/index');
const { Op } = require('sequelize'); // Importar Sequelize para literales


//====================
// FUNCION GET OBTENER LISTA DE OFICIOS
//====================

exports.getCategoriesTittles = async (req, res) => {
    try {
        console.log( {message: 'Lista de oficios.'});

        const jobs = await Category.findAll({
            attributes: ['id', 'title', 'description', 'status']
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
        const { job_id, minRating, lat, lng, radiusKm = 20 } = req.query;

        const userLat = lat ? parseFloat(lat) : null;
        const userLng = lng ? parseFloat(lng) : null
        const radius = radiusKm ? parseFloat(radiusKm) : 20
        const ratingFilter = minRating ? parseFloat(minRating) : 0

        let whereConditions = {
            is_available: true
        };
        
        // 1. FILTRO POR OFICIO
        if (job_id) {
            whereConditions.job_id = job_id;
        }

        const attributes = [
            'id', 'firstname', 'lastname', 'description', 'latitude', 'longitude', 'job_id', 'picture'
        ];

        // ATRIBUTO: DISTANCIA (Haversine)
        let distanceLiteral = null;

        const replacements = {}

        if (userLat && userLng) {
            replacements.lat = userLat
            replacements.lng = userLng
            replacements.radius = radius

            distanceLiteral = Sequelize.literal(`(
                6371 * acos(
                    cos(radians(:lat)) * cos(radians(Professional.latitude))
                    * cos(radians(Professional.longitude) - radians(:lng)) + 
                    sin(radians(:lat)) * sin(radians(Professional.latitude))
                )
            )`)

            attributes.push([distanceLiteral, 'distance_km'])

            whereConditions[Op.and] = Sequelize.where(distanceLiteral, {
                [Op.lte]: radius
            })
            
            // // Filtro de radio
            // whereConditions[Op.and] = [
            //     Sequelize.literal(`(
            //         6371 * acos(
            //             cos(radians(${userLat})) * cos(radians(Professional.latitude))
            //             * cos(radians(Professional.longitude) - radians(${userLng})) + 
            //             sin(radians(${userLat})) * sin(radians(Professional.latitude))
            //         )
            //     ) <= ${radius}`)
            // ];
        }

        // CALIFICACIÓN PROMEDIO (Subquery)
        
        const ratingLiteral = Sequelize.literal(`(
            SELECT COALESCE(AVG(r.rating), 0)
            FROM reviews AS r
            INNER JOIN contracts AS c ON r.contract_id = c.id
            WHERE c.professional_id = Professional.id
        )`);

        attributes.push([ratingLiteral, 'average_rating'])

        // FILTRO POR CALIFICACIÓN (HAVING)
        let havingConditions = null;

        if (minRating) {
            // Filtramos usando el literal que acabamos de definir
            havingConditions = Sequelize.where(ratingLiteral, {
                [Op.gte]: ratingFilter
            });
        }

        // EJECUTAR BÚSQUEDA
        const fixers = await Professional.findAll({
            attributes: attributes,
            where: whereConditions,
            include: [
                {
                    model: Job,
                    as: 'job',
                    attributes: ['title']
                }
            ],
            having: havingConditions,
            replacements: replacements,
            order: distanceLiteral
            ? [[Sequelize.col('distance_km'), 'ASC']] // Ordenar por cercanía si hay ubicación
            : [['id', 'DESC']] // Si no mostrar los mas nuevos primero
        });

        if (!fixers || fixers.length === 0) {
            return res.status(404).json({ message: "No existen Fixers que coincidan con los criterios de búsqueda."});
        }

        return res.status(200).json({
            message: 'Busqueda exitosa.',
            results: fixers,
        });

    } catch (error) {
        console.error('Error al buscar fixers:', error);
        return res.status(500).json({ message: 'Error interno del servidor al realizar la búsqueda.', error: error.message });
    }
};

exports.getFixerProfilePublic = async (req, res) => {
    try {
        console.log("Visualizar el perfil de un Fixer en especifico.");

        const { id } = req.params

        const fixerProfile =  await Professional.findByPk( id, {
        attributes: [
            'id', 'firstname', 'lastname', 'picture', 
            'description', 'experience_years', // (Si tienes rating)
            'is_verified', 'latitude', 'longitude' // Para el mapa futuro
            // OJO: No devolvemos 'phone' ni 'email' si quieres que primero contraten
        ],
        include: [{
            model: Job, // Importar modelo job
            as: 'job',
            attributes: ['title'] // nombre del oficio
        }]
    });

    if (!fixerProfile) {
        return res.status(404).json({ message: "Fixer no encontrado."});
    }

        return res.status(200).json({ 
            profile: fixerProfile
        });

    } catch (error) {
        console.error("Error al obtener la información del fixer.", error);
        return res.status(500).json({message: "Error del servidor al obtener informacion de fixer."});
    }
};

module.exports = {
    getFixerProfilePublic: this.getFixerProfilePublic,
    searchFixers: this.searchFixers,
    getJobTittles: this.getJobTittles,
    getCategoriesTittles: this.getCategoriesTittles

};