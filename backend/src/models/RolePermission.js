const { DataTypes } = require('sequelize');
const Sequelize = require('../config/database');

    const RolePermission = Sequelize.define('RolePermission', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        role_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        permission_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {

        timestamps: true, 
        tableName: 'role_permission', 
        underscored: true,
        freezeTableName: true

    }

);
    module.exports = RolePermission;