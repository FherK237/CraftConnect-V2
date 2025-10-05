const { DataTypes } = require('sequelize');
const Sequelize = require('../config/database');

    const Booking = Sequelize.define('Booking', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
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
        comission_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {

        timestamps: true, 
        tableName: 'bookings', 
        underscored: true,
        freezeTableName: true

    }
    );

    module.exports = Booking;