const { DataTypes } = require('sequelize');
const Sequelize = require('../config/database');

    const Permission = Sequelize.define('Permission', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true, 
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'El nombre del permiso no puede ser vacío'
                },
                min: {
                    args: [3],
                    msg: 'El minimo caracteres para el nombre del permiso es de 3'
                },
                max: {
                    args: [100],
                    msg: 'El maximo de caracteres para el nombre del permiso es de 100'
                }
            }
        }
    }, {
        timestamps: true, 
        tableName: 'permissions', 
        underscored: true,
        freezeTableName: true
    }
)

    module.exports = Permission;