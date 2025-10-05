const { DataTypes } = require('sequelize');
const Sequelize = require('../config/database');

    const Role = Sequelize.define('Role', {
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
                    msg: 'El nombre del rol no puede ser vacío'
                },
                min: {
                    args: [3],
                    msg: 'El minimo de caracteres para el nombre del rol es 3'
                },
                max: {
                    args: [100],
                    msg: 'El maximo de caracteres para el nombre del rol es 100'
                }
            }
        }
    }, {

        timestamps: true, 
        tableName: 'roles', 
        underscored: true,
        freezeTableName: true
        
    }
);
    module.exports = Role;