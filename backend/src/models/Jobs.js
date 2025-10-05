const { DataTypes } = require('sequelize');
const Sequelize = require('../config/database');

    const Job = Sequelize.define('Job', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true, 
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'El titulo de la profesión no puede ser vacío'
                },
                min: {
                    args: [3],
                    msg: 'El título de la profesión debe tener por lo menos 3 caracteres'
                },
                max: {
                    args: [100],
                    msg: 'El títulod de la profesión no debe exceder los 100 caracteres'
                }
            }
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'La descripción de la profesión no puede ser vacío.'
                }
            }
        }
    }, {

        timestamps: true, 
        tableName: 'Jobs', 
        underscored: true,
        freezeTableName: true

    }
);

    module.exports = Job;