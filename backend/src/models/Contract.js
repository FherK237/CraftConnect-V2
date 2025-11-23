const { DataTypes } = require('sequelize');
const Sequelize = require('../config/database');


    const Contract = Sequelize.define('Contract', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        price: { 
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false, // Opcional: TRUE si el precio puede ser calculado después
        },
        start_datetime: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'La fecha y hora de inicio son obligatorias.'
                },
                isDate: {
                    msg: 'El valor debe ser una fecha y hora válida.'
                },
                // Asegura que la cita no se agende en el pasado
                isFuture(value) {
                    if (new Date(value) < new Date()) {
                        throw new Error('La cita debe ser programada para una fecha y hora futura.');
                    }
                }
            }
        },
        end_datetime: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'La fecha y hora de termino son obligatorias.'
                },
                isDate: {
                    msg: 'El valor debe ser una fecha y hora válida.'
                }
            }
        },
        status: {
            type: DataTypes.ENUM('pending', 'confirmed', 'completed', 'canceled'), 
            allowNull: false,
            defaultValue: 'pending',
            validate: {
                notEmpty: {
                    msg: 'El estado no puede ser vacío.'
                },
                // 2. Opcional: Validación explícita de inclusión (aunque ENUM ya lo hace a nivel de DB)
                isIn: {
                    args: [['pending', 'confirmed', 'completed', 'canceled']],
                    msg: 'Estado no válido. Debe ser uno de: pending, confirmed, completed, o canceled.'
                }
            }
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        professional_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        service_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        commission_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    }, {

        timestamps: true, 
        tableName: 'contracts', 
        underscored: true,
        freezeTableName: true

    }
    );

    module.exports = Contract;
