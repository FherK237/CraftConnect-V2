const { Job } = require('../models/index');
const { saveFile, saveFileProfessional } = require('../utils/saveFile');
const { validationResult } = require('express-validator');
const { User, Professional } = require('../models/index');

    exports.formConfigureUser = async(req, res) => {
        try {
            const { id } = req.user;
            const user = await User.findByPk(id,{
                attributes: ['firstname','lastname','phone','picture','birth_date','latitude','longitude']
            });
        
            res.json({user: user});
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    // VISUALIZAR INFORMACION DE FIXER
    exports.formConfigureFixer = async(req, res) => {
        try {
            const { id } = req.user;
            const professional = await Professional.findByPk(id, {
                attributes: ['firstname', 'lastname', 'phone', 'picture', 'birth_date', 'company_name', 'description', 'is_available',  'experience_years', 'latitude', 'longitude']
            });
            const jobs = await Job.findAll();

            res.json({
                professional,
                jobs
            });

        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: error.message });
        }
    }

    exports.ConfigureUser = async (req, res) => {
        try {
            console.log("🔥 PETICIÓN RECIBIDA EN UPDATE");
            console.log("Body (Texto):", req.body);
            console.log("File (Imagen):", req.file);
            //Validar campos
            const errors = validationResult(req);
                if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
                
            const { id } = req.user;
            const { firstname, lastname, phone, birth_date, latitude, longitude } = req.body;
            const picture = saveFile(req.file, 'profiles/image_user');

            if (!firstname || !lastname) return res.status(400).json({ message: 'El nombre y apelidos no pueden ser vacios.'});

            const dataUpdate = {
                firstname,
                lastname,
                phone,
                ...(picture && { picture }),
                birth_date,
                latitude,
                longitude
            };

            const result = await User.update(dataUpdate, { where: { id }});

            if (!result || (Array.isArray(result) && result[0] === 0)) return res.status(404).json({ message: 'Usuario no encontrado o sin cambios' });
            
            res.status(200).json({ message: 'Perfil actualizado correctamente.'});

        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: error.message });
        }
    }

    exports.ConfigureFixer = async(req, res) => {
        try {
            
            //Validar campos
            const errors = validationResult(req);
            if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

            const { id } = req.user;
            const { 
                    firstname, lastname, phone, 
                    birth_date, company_name, description, 
                    experience_years, latitude, longitude, job_id 
            } = req.body;
            
            let cleanJobId = job_id;
            if (!job_id || job_id === "" || job_id === "null" || job_id === "undefined") {
                cleanJobId = null; 
            }

            if (!cleanJobId) {
                return res.status(400).json({ message: "Debes seleccionar un oficio válido." });
            }

            let picturePath = null;

            if (req.file) {
                picturePath = req.file.path.replace(/\\/g, "/")
            }

            if ( !firstname || !lastname ) {
                return res.status(400).json({ message: 'Todos los campos son obligatorios.'})
            }

            const dataUpdate = {
                firstname, lastname, phone, birth_date, company_name, description, experience_years, latitude, longitude, job_id: cleanJobId,
            
            ...(picturePath && { picture: picturePath }),
            }

            const [updatedRows] = await Professional.update(dataUpdate, { where: { id }});

            if (updatedRows === 0) {
                return res.status(200).json({ message: 'Datos guardados (Sin cambios detectados).' });
            }

            return res.status(200).json({ message: 'Perfil profesional actualizado correctamente.' });

            } catch (error) {
                console.log(error);
                return res.status(500).json({ message: "Error interno del servidor" });
            } 
    }

    exports.IneFixer = async(req, res) => {
        try {
            const { id } = req.user;
            const { image_ine_front, image_ine_back } = saveFileProfessional(req.files);
            if (!image_ine_front || !image_ine_back) return res.status(400).json({ message: 'Todos los campos son obligatorios.'});

                const result = await Professional.update({image_ine_front: image_ine_front, image_ine_back: image_ine_back}, { where: { id }});

                if (!result || (Array.isArray(result) && result[0] === 0)) return res.status(404).json({ message: 'Profesional no encontrado o sin cambios' });

                    return res.status(200).json({ message: 'INE agregada correctamente.' });

        } catch (error) {
            console.log(error);
                return res.status(400).json({ message: error.message });
        }
    }


    module.exports = {
        formConfigureUser:      this.formConfigureUser,
        formConfigureFixer:     this.formConfigureFixer,
        ConfigureUser:          this.ConfigureUser,
        ConfigureFixer:         this.ConfigureFixer,
        IneFixer:               this.IneFixer
    }