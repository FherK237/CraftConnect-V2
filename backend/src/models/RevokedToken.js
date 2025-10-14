const { DataTypes } = require('sequelize');
const Sequelize = require('../config/database');

    const RevokedToken = Sequelize.define('RevokedToken', {
        token: {
            type: DataTypes.STRING(512),
            primaryKey: true,
            allowNull: false,
        },
        exp: {
            type: DataTypes.BIGINT,
            allowNull: false,
        }
    }, {

        timestamps: true, 
        tableName: 'RevokedToken', 
        underscored: true,
        freezeTableName: true

    }
);

    module.exports = RevokedToken;