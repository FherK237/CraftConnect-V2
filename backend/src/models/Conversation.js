const { DataTypes } = require('sequelize');
const Sequelize = require('../config/database');

    const Conversation = Sequelize.define('Conversation', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        sender_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        receiver_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        sender_type: {
            type: DataTypes.ENUM('user','professional'),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'El remitente no puede ser vacío'
                },
                // 2. Opcional: Validación explícita de inclusión (aunque ENUM ya lo hace a nivel de DB)
                isIn: {
                    args: [['user','professional']],
                    msg: 'Estado no válido. Debe ser uno de: user, professional.'
                }
            }
        },
        receiver_type: {
            type: DataTypes.ENUM('user','professional'),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'El receptor no puede ser vacío'
                },
                isIn: {
                    args: [['user','professional']],
                    msg: 'Estado no válido. Debe ser uno de: user, professional.'
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
        }
    },
    {
        timestamps: true, 
        tableName: 'conversations', 
        underscored: true,
        freezeTableName: true        
    }
);

    module.exports = Conversation;