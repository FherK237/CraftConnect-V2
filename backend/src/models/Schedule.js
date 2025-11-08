const { DataTypes } = require('sequelize');
const Sequelize = require('../config/database');

    const Schedule = Sequelize.define('Schedule', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        day_of_week: {
            type: DataTypes.ENUM('lunes','martes','miercoles','jueves','viernes','sabado','domingo'),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'El dia de la semana no puede ser vacío.'
                },
                // 2. Opcional: Validación explícita de inclusión (aunque ENUM ya lo hace a nivel de DB)
                isIn: {
                    args: [['lunes','martes','miercoles','jueves','viernes','sabado','domingo']],
                    msg: 'Estado no válido. Debe ser uno de: pending, lunes, martes, miercoles, jueves, viernes, sabado, domingo.'
                }
            }
        },
        start_time: {
            type: DataTypes.TIME,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'La hora de inicio es obligatoria.'
                },
                is: {
                    // REGEX básica para validar formato HH:MM:SS o HH:MM
                    args: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/, 
                    msg: 'El formato de la hora de inicio no es válido (ej: 09:00:00).'
                }
            }
        },
        end_time: {
            type: DataTypes.TIME,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'La hora de finalización es obligatoria.'
                },
                is: {
                    args: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/, 
                    msg: 'El formato de la hora de finalización no es válido (ej: 17:00:00).'
                },
                // Validación personalizada para asegurar que end_time > start_time
                isLaterThanStart(value) {
                    if (value <= this.start_time) {
                        throw new Error('La hora de finalización debe ser posterior a la hora de inicio.');
                    }
                }
            }
        },
        status: {
            type: DataTypes.ENUM('available','unavailable'),
            allowNull: false,
            defaultValue: 'available',
            validate: {
                notEmpty: {
                    msg: 'El status del horario no puede ser vacío.'
                },
                // 2. Opcional: Validación explícita de inclusión (aunque ENUM ya lo hace a nivel de DB)
                isIn: {
                    args: [['available','unavailable']],
                    msg: 'Estado no válido. Debe ser uno de: available, unavailable.'
                }
            }
        },
        professional_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {

        timestamps: true, 
        tableName: 'schedules', 
        underscored: true,
        freezeTableName: true

    }
);

    module.exports = Schedule;