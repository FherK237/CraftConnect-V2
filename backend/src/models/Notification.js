const { Datatypes } = require('sequelize');
const Sequelize = require('../config/database');

    const Notification = Sequelize.define('Notification', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,

        },
        recipient_id: {
            type: Datatypes.INTEGER,
            allowNull: false,
        },
        recipient_type: {
            type: Datatypes.ENUM('user','professional'),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'El tipo de destinatario no puede ser vacío'
                },
                isIn: {
                    args: [['user', 'professional']],
                    msg: 'Estado no válido. Debe ser uno de: user, professional.'
                }
            }
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'El título de la notificación no puede ser vacía.'
                },
                min: {
                    args: [3],
                    msg: 'EL título de la notificación mínima debe tener 3 caracteres.'
                },
                max: {
                    args: [100],
                    msg: 'El maximo de caracteres para el título de la notificación es de 100'
                }
            }
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'El mensaje no puede estar vacío.'
                },
                len: {
                    args: [3, 2000],
                    msg: 'El mensaje debe tener entre 3 y 2000 caracteres.'
                }
            }
        },
        is_read: {
            type: DataTypes.BOOLEAN, 
            allowNull: false,
            defaultValue: false,
            validate: {
                isBoolean: {
                    msg: 'El estado de lectura debe ser verdadero o falso (true/false).'
                }
            }
        }
    },
    {
        timestamps: true, 
        tableName: 'notifications', 
        underscored: true,
        freezeTableName: true
    }

);

    module.exports = Notification;