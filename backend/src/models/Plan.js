const { DataTypes } = require('sequelize');
const Sequelize = require('../config/database');

    const Plan = Sequelize.define('Plan', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'El nombre del plam no puede ser vacío.'
                },
                min: {
                    args: [3], 
                    msg: 'El minimo de caracteres para el nombre del plan es 3'
                },
                max: {
                    args: [100],
                    msg: 'El maximo de caracteres del nombre del plan es 100'
                }
            }
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'La descripción no puede ser vacía'
                }
            }
        },
        price: {
            type: DataTypes.DECIMAL,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'El precio no puede ser vacío.'
                },
                min: {
                    args: [0.01],
                    msg: 'El precio de la suscripción tiene que ser mayor a 0'
                },
                max: {
                    args: [9999.99], 
                    msg: 'El precio excede el límite permitido.'
                }
            }
        },
        duration_days: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'La duración en días no puede estar vacía.'
                },
                min: {
                    args: [1], 
                    msg: 'Minimo de dias permitido es de 1'
                },
                max: {
                    args: [365],
                    msg: 'Los dias exceden el limite permitido'
                }
            }
        },
        max_services: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'EL maximo de servicios no puede ser vacía.'
                },
                 isNumeric: {
                    msg: 'El máximo de servicios debe ser un número entero.'
                },
                min: {
                    args: [1], 
                    msg: 'El mínimo de servicios permitidos debe ser al menos 1.'
                },
                max: {
                    args: [100], 
                    msg: 'El máximo de servicios excede el límite permitido (100).'
                }

            }

        }
    }, {
        timestamps: true, 
        tableName: 'plans', 
        underscored: true,
        freezeTableName: true
    }
);

    module.exports = Plan;