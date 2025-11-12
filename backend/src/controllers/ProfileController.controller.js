const { Job } = require('../models/index');
const { saveFile, saveFileProfessional } = require('../utils/saveFile');
const { validationResult } = require('express-validator');


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

    exports.formConfigureProfessional = async(req, res) => {
        try {
            const { id } = req.user;
            const professional = await Professional.findByPk(id, {
                attributes: ['firstname', 'lastname', 'phone', 'picture', 'birth_date', 'company_name', 'description', 'is_available',  'experience_years', 'image_ine_front', 'image_ine_back', 'latitude', 'longitude']
            });
            const jobs = await Job.findAll();

            res.json({professional: professional, jobs: jobs});

        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: error.message });
        }
    }

    exports.ConfigureUser = async(req, res) => {
        try {
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

    exports.ConfigureProfessional = async(req, res) => {
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
                  
            const { picture, image_ine_front, image_ine_back } = saveFileProfessional(req.files);

            if ( !firstname || !lastname || !phone || !birth_date || !company_name ||
                 !description || !experience_years || !latitude || !longitude || 
                 !job_id || !picture || !image_ine_front || !image_ine_back ) {
                    return res.status(400).json({ message: 'Todos los campos son oblihatorios.'})
            }

            const dataUpdate = {
                firstname, lastname, phone, birth_date, company_name, description, experience_years, latitude, longitude, job_id, ...(picture && { picture }), ...(image_ine_front && { image_ine_front }), ...(image_ine_back && { image_ine_back }),
            }

            const result = await Professional.update(dataUpdate, { where: { id }});

            if (!result || (Array.isArray(result) && result[0] === 0)) return res.status(404).json({ message: 'Profesional no encontrado o sin cambios' });

            return res.status(200).json({ message: 'Perfil profesional actualizado correctamente.' });

       } catch (error) {
            console.log(error);
            return res.status(400).json({ message: error.message });
       } 
    }


    module.exports = {
        formConfigureUser: this.formConfigureUser,
        formConfigureProfessional: this.formConfigureProfessional,
        ConfigureUser: this.ConfigureUser,
        ConfigureProfessional: this.ConfigureProfessional
    }