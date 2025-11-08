const { DataTypes } = require('sequelize');
const Sequelize = require('../config/database');

    const Portfolio = Sequelize.define('Portfolio', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'El título del portafolio no puede ser vacía.'
                },
                min: {
                    args: [3],
                    msg: 'EL título del portafolio mínimo debe tener 3 caracteres.'
                },
                max: {
                    args: [100],
                    msg: 'El maximo de caracteres para el título del portafolio es de 100'
                }
            }
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'La descripción de la categoria no puede ser vacía.'
                }
            }
        },
        completion_date: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'La fecha de realización no puede ser vacía'
                },
                isDate: {
                    msg: 'El valor debe ser una fecha y hora válida.'
                },
            }
        },
        image_url: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'La imagen del portafolio no puede ser vacía'
                }
            }
        },
        contract_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        timestamps: true, 
        tableName: 'portfolio', 
        underscored: true,
        freezeTableName: true        
    }

);

    module.exports = Portfolio;