const path = require('path');
const fs = require('fs');

    const saveFile = (file, folder) => {
        if (!file) return null;
        const uploadDir  = path.join(__dirname, '..', 'uploads', folder);
        const newFileName = `${Date.now()}-${file.originalname}`;
            const newPath = path.join(uploadDir, newFileName);
                fs.renameSync(file.path, newPath);
                    return `/uploads/${folder}/${newFileName}`;
    }

    const saveFileProfessional = (files) => {
        return {
            image_ine_front: saveFile(files?.image_ine_front?.[0], 'profiles/docs/ine_front'),
            image_ine_back: saveFile(files?.image_ine_back?.[0], 'profiles/docs/ine_back')
        }
    }

    module.exports = {
        saveFile,
        saveFileProfessional
    }