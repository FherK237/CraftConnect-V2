const { DataTypes } = require('sequelize');
const Sequelize = require('../config/database');


    const Location = Sequelize.define('Location', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        country: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'El pais no puede ser vacío'
                },
                min: {
                    args: [2],
                    msg: 'El Pais debe tener entre 2 y 100 caracteres.'
                },
                max: {
                    args: [100],
                    msg: 'El Pais debe tener entre 2 y 100 caracteres'
                }
            }
        },
        state: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'El Estado no puede ser vacío'
                },
                min: {
                    args: [2],
                    msg: 'El Estado debe tener entre 2 y 100 caracteres.'
                },
                max: {
                    args: [100],
                    msg: 'El Estado debe tener entre 2 y 100 caracteres'
                }
            }
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'La Ciudad no puede ser vacío'
                },
                min: {
                    args: [2],
                    msg: 'La Ciudad debe tener entre 2 y 100 caracteres.'
                },
                max: {
                    args: [100],
                    msg: 'La Ciudad debe tener entre 2 y 100 caracteres'
                }
            }
        },
        postal_code: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'El código postal no puede ser vacío.'
                },
                min: {
                    args: [4],
                    msg: 'El código postal debe tener por lo menos 4 caracteres'
                },
                max: {
                    args: [10],
                    msg: 'El código postal no puede tener mas de 10 caracteres'
                },
                is: {
                    args: /^[a-zA-Z0-9- ]+$/, 
                    msg: 'El código postal contiene caracteres no válidos.'
                }
            }
        },
        address: {
            type: DataTypes.STRING(255),
            allowNull: false, 
            validate: {
                notEmpty: {
                    msg: 'La dirección no puede ser vacía.'
                },
                min: {
                    args: [5, 255],
                    msg: 'La dirección debe tener por lo menos 5 caracteres.'
                },
                max: {
                    args: [255],
                    msg: 'La dirección no debe exceder los 255 caracteres.'
                }
            }
        },
        latitude: {
            type: DataTypes.DECIMAL(10, 8),
            allowNull: false,
            validate: {
                isDecimal: {
                    msg: 'La latitud debe ser un valor decimal válido.'
                },
                notEmpty: {
                    msg: 'La latitud no puede ser vacía.'
                },
                min: {
                    args: [-90],
                    msg: 'La latitud mínima permitida es -90.'
                },
                max: {
                    args: [90],
                    msg: 'La latitud máxima permitida es 90.'
                }
            }
        },
        longitude: {
            type: DataTypes.DECIMAL(11, 8),
            allowNull: false,
            validate: {
                isDecimal: {
                    msg: 'La longitud debe ser un valor decimal válido.'
                },
                notEmpty: {
                    msg: 'La longitud no puede ser vacía.'
                },
                min: {
                    args: [-180],
                    msg: 'La longitud mínima permitida es -180.'
                },
                max: {
                    args: [180],
                    msg: 'La longitud máxima permitida es 180.'
                }
            }
        },
        type: {
            type: DataTypes.ENUM('home','work','other'),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'El tipo de lugar no puede ser vacío'
                },
                // 2. Opcional: Validación explícita de inclusión (aunque ENUM ya lo hace a nivel de DB)
                isIn: {
                    args: [['home','work','other']],
                    msg: 'Estado no válido. Debe ser uno de: home, work, other.'
                }
            }
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }, 
        professional_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        timestamps: true, 
        tableName: 'locations', 
        underscored: true,
        freezeTableName: true
    }
);

    module.exports = Location;

