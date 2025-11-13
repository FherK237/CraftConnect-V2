const { DataTypes } = require('sequelize');
const Sequelize = require('../config/database');

    const Comission = Sequelize.define('Comission', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true, 
            autoIncrement: true
        },
        total_amount: {
            type: DataTypes.DECIMAL(10,2),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'El monto total es obligatorio.'
                },
                isNumeric: {
                    msg: 'El monto total debe ser un valor numérico.'
                },
                min: {
                    args: [0.01],
                    msg: 'El monto total debe ser mayor a cero.'
                }
            }
        },
        commission: {
            type: DataTypes.DECIMAL(10, 2), 
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'El monto de la comisión es obligatorio.'
                },
                isNumeric: {
                    msg: 'El monto de la comisión debe ser un valor numérico.'
                },
                min: {
                    args: [0.00],
                    msg: 'El monto de la comisión no puede ser negativo.'
                }
            }
        },
        
        status: {
            type: DataTypes.ENUM('pending', 'paid', 'reversed', 'failed'), 
            allowNull: false,
            defaultValue: 'pending',
            validate: {
                isIn: {
                    args: [['pending', 'paid', 'reversed', 'failed']],
                    msg: 'Estado de comisión no válido.'
                }
            }
        },

    }, {

        timestamps: true, 
        tableName: 'commissions', 
        underscored: true,
        freezeTableName: true

    });

    module.exports = Comission;