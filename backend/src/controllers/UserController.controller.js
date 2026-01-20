const { Job, Professional, Review, Sequelize} = require('../models/index');
const { Op } = require('sequelize'); // Importar Sequelize para literales


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
        const { job_id, minRating, lat, lng, radiusKm = 20 } = req.query;

        let whereConditions = {
            role: 'professional',
            is_available: true
        };
        
        // 1. FILTRO POR OFICIO
        if (job_id) {
            whereConditions.job_id = job_id;
        }

        // 2. ATRIBUTO: DISTANCIA (Haversine)
        let distanceAttribute = null;
        if (lat && lng) {
            const userLat = parseFloat(lat);
            const userLng = parseFloat(lng);
            const radius = parseFloat(radiusKm);

            distanceAttribute = Sequelize.literal(`(
                6371 * acos(
                    cos(radians(${userLat})) * cos(radians(Professional.latitude))
                    * cos(radians(Professional.longitude) - radians(${userLng})) + 
                    sin(radians(${userLat})) * sin(radians(Professional.latitude))
                )
            )`);
            
            // Filtro de radio
            whereConditions[Op.and] = [
                Sequelize.literal(`(
                    6371 * acos(
                        cos(radians(${userLat})) * cos(radians(Professional.latitude))
                        * cos(radians(Professional.longitude) - radians(${userLng})) + 
                        sin(radians(${userLat})) * sin(radians(Professional.latitude))
                    )
                ) <= ${radius}`)
            ];
        }

        // 3. ATRIBUTO: CALIFICACIÓN PROMEDIO (Subquery Corregida)
        // 🛑 CORRECCIÓN: Calculamos el promedio buscando en reviews -> contracts -> professional
        // Nota: Asegúrate que tu tabla en DB se llame 'reviews' y 'contracts' y la FK sea 'contracts_id' o 'contract_id'
        const ratingLiteral = Sequelize.literal(`(
    SELECT AVG(r.rating)
    FROM reviews AS r
    INNER JOIN contracts AS c ON r.contract_id = c.id
    WHERE c.professional_id = Professional.id
)`);

        // 4. FILTRO POR CALIFICACIÓN (HAVING)
        let havingConditions = null;
        if (minRating) {
            // Filtramos usando el literal que acabamos de definir
            havingConditions = Sequelize.where(ratingLiteral, { [Op.gte]: parseFloat(minRating) });
        }

        // 5. EJECUTAR BÚSQUEDA
        const fixers = await Professional.findAll({
            attributes: [
                'id', 'firstname', 'lastname', 'description', 'latitude', 'longitude', 'job_id', 'picture',
                // Añadimos los atributos calculados
                [ratingLiteral, 'average_rating'],
                ...(distanceAttribute ? [[distanceAttribute, 'distance_km']] : [])
            ],
            where: whereConditions,
            include: [
                // Incluimos el Job para ver el nombre del oficio
                { model: Job, as: 'job', attributes: ['title'] }
            ],
            
            having: havingConditions,
            order: distanceAttribute ? [[Sequelize.literal('distance_km'), 'ASC']] : [['id', 'ASC']]
        });

        if (!fixers || fixers.length === 0) {
            return res.status(404).json({ message: "No existen Fixers que coincidan con los criterios de búsqueda."});
        }

        return res.status(200).json({
            message: 'Fixers encontrados con éxito.',
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

module.exports = {
    getFixerProfilePublic: this.getFixerProfilePublic,
    searchFixers: this.searchFixers,
    getJobTittles: this.getJobTittles


};