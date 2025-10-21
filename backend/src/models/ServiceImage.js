const { DataTypes } = require('sequelize');
const Sequelize = require('../config/database');

    const ServiceImage = Sequelize.define('ServiceImage', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        image_service: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {                     
                    msg:  'La URL de la imagen del servicio no puede ser vacía.'
                }
            }
        },
        description: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {
                    msg: 'La descripción de la imagen del servicio no puede ser vacía.'
                }
            }
        },
        is_main: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            validate: {
                isBoolean(value) {
                    // Verifica que el valor sea true o false (no "1", "0", "true", "false", etc.)
                    if (value !== true && value !== false) {
                        throw new Error('is_main debe ser true o false.');
                    }
                }
            }
        },
        service_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {

        timestamps: true, 
        tableName: 'service_images', 
        underscored: true,
        freezeTableName: true

    });

    module.exports = ServiceImage;