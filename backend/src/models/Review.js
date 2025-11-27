const { DataTypes } = require('sequelize');
const Sequelize = require('../config/database');

    const Review = Sequelize.define('Review', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        comment: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'El comentario de la reseña no puede ser vacío.'
                },
                len: {
                    args: [3, 2000],
                    msg: 'El Comentario de la reseña debe tener entre 3 y 2000 caracteres.'
                }
            }
        },
        rating: {
            type: DataTypes.INTEGER, 
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'La calificación no puede ser vacía.'
                },
                isInt: {
                    msg: 'La calificación debe ser un número entero.'
                },
                min: {
                    args: [1],
                    msg: 'La calificación mínima es 1 estrella.'
                },
                max: {
                    args: [5],
                    msg: 'La calificación máxima es 5 estrellas.'
                }
            }
        },
        contract_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },{

        timestamps: true, 
        tableName: 'reviews', 
        underscored: true,
        freezeTableName: true            

    }

);


    module.exports = Review;