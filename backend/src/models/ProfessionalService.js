const { DataTypes } = require('sequelize');
const Sequelize = require('../config/database');

    const ProfessionalService = Sequelize.define('ProfessionalService', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true, 
            autoIncrement: true
        },
        base_price: {
            type: DataTypes.DECIMAL(10, 2), 
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'El precio es obligatorio y no puede estar vacío.'
                },
                isNumeric: {
                    msg: 'El precio debe ser un valor numérico válido.'
                },
                min: {
                    args: [0.01], 
                    msg: 'El precio debe ser mayor a cero.'
                }
            }
        },
        status: {
            type: DataTypes.ENUM('active', 'paused', 'draft'),
            allowNull: false,
            defaultValue: 'active',
            validate: {
                notEmpty: {
                    msg: 'El status del servicio no puede ser vacio'
                },
                 // 2. Opcional: Validación explícita de inclusión (aunque ENUM ya lo hace a nivel de DB)
                isIn: {
                    args: [['active', 'paused', 'inactive']],
                    msg: 'Estado no válido. Debe ser uno de: active, inactive.'
                }
            }
        },
        professional_description: {
            type: DataTypes.TEXT,
            validate: {
                notEmpty: {
                    msg: 'La descripción del profesional acerca de su servicio no puede ser vacía.'
                }
            }
        },
        professional_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        service_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {

        timestamps: true, 
        tableName: 'professional_service', 
        underscored: true,
        freezeTableName: true

    }
);
    
    module.exports = ProfessionalService;