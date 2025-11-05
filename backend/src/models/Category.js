const { DataTypes } = require('sequelize');
const Sequelize = require('../config/database');

    const Category = Sequelize.define('Category', {
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
                    msg: 'El título de la categoria no puede ser vacía.'
                },
                min: {
                    args: [3],
                    msg: 'EL título de la categoria mínima debe tener 3 caracteres.'
                },
                max: {
                    args: [100],
                    msg: 'El maximo de caracteres para el título de la categoria es de 100'
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
    }, {

        timestamps: true, 
        tableName: 'categories', 
        underscored: true,
        freezeTableName: true
        
    }
);

    module.exports = Category;

