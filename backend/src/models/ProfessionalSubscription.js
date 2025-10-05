const { DataTypes } = require('sequelize');
const Sequelize = require('../config/database');

    const ProfessionalSuscription = Sequelize.define('ProfessionalSuscription', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        start_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            validate: {
                isDate: {
                    msg: 'La fecha de inicio debe ser una fecha válida (YYYY-MM-DD).'
                }
            }
        },
        end_date: {
            type: DataTypes.DATEONLY,
            allowNull: true,
            validate: {
                isDate: {
                    msg: 'La fecha de fin debe ser una fecha válida (YYYY-MM-DD).'
                },
                isAfterStart(value) {
                    if (value && this.start_date && new Date(value) <= new Date(this.start_date)) {
                        throw new Error('La fecha de fin debe ser posterior a la fecha de inicio.');
                    }
                }
            }
        },
        
        status: {
            type: DataTypes.ENUM('active', 'expired', 'cancelled', 'pending'), 
            allowNull: false,
            defaultValue: 'pending', 
            validate: {
                isIn: {
                    args: [['active', 'expired', 'cancelled', 'pending']],
                    msg: 'Estado de suscripción no válido.'
                }
            }
        },
        professional_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        plan_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
 
        timestamps: true, 
        tableName: 'professional_suscripcion', 
        underscored: true,
        freezeTableName: true

    });

    module.exports = ProfessionalSuscription;