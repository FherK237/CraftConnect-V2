const { DataTypes } = require('sequelize');
const Sequelize = require('../config/database');

    const Service = Sequelize.define('Service', {
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
                    msg: 'El título del servicio no puede ser vacío.'
                },
                min: {
                    args: [3],
                    msg: 'EL título del servicio debe tener por lo menos 3 caracteres.'
                },
                max: {
                    args: [100],
                    msg: 'EL título del servicio mo debe exceder los 100 caracteres.'
                }
            }
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'La descripción del servicio no puede ser vacío.'
                }
            }
        },
        status: {
            type: DataTypes.ENUM('active','inactive'),
            allowNull: false,
            defaultValue: 'active',
            validate: {
                notEmpty: {
                    msg: 'El status del servicio no puede ser vacio'
                },
                 // 2. Opcional: Validación explícita de inclusión (aunque ENUM ya lo hace a nivel de DB)
                isIn: {
                    args: [['active','inactive']],
                    msg: 'Estado no válido. Debe ser uno de: active, inactive.'
                }
            }
        },
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {

        timestamps: true, 
        tableName: 'services', 
        underscored: true,
        freezeTableName: true

    }
);

    module.exports = Service;