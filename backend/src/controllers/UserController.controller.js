const { Job, Professional } = require('../models/index');



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

module.exports = {
    getFixerProfilePublic: this.getFixerProfilePublic,
    searchFixers: this.searchFixers,
    getJobTittles: this.getJobTittles


};