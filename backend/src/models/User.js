const { DataTypes } = require('sequelize');
const Sequelize = require('../config/database');

    const User = Sequelize.define('User', {
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
                    msg: 'El nombre del usuario no puede ser vacío'
                }, 
                min: {
                    args: [3],
                    msg: 'El nombre del usuario debe tener por lo menos 3 caracteres.'
                }, 
                max: {
                    args: [100], 
                    msg: 'El nombre del usuario no debe tener mas de 100 caracteres.'
                }
            }
        },
        last_name: {
            type: DataTypes.STRING, 
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Los apeliidos del usuario no puede ser vacío'
                }, 
                min: {
                    args: [3],
                    msg: 'Los apeliidos del usuario debe tener por lo menos 3 caracteres.'
                }, 
                max: {
                    args: [100], 
                    msg: 'Los apeliidos del usuario no debe tener mas de 100 caracteres.'
                }
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                trim: true,         // Elimina espacios al inicio y fin
                isLowercase: true,  // Convierte a minúsculas antes de guardar
                notEmpty: {
                    msg: 'El correo del usuario no debe ser vacio'
                },
                isEmail: {
                    msg: 'Debe ser un correo válido'
                },
                min: {
                    args: [5],
                    msg: 'El correo debe por lo menos tener 5 caracteres'
                },
                max: {
                    args: [150],
                    msg: 'El correo no debe exceder los 150 caracteres'
                }
            }
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'La contraseña del usuario no debe ser vacía'
                },
                len: {
                    // Estándar de seguridad: Mínimo 8 caracteres, Máximo 72 (antes de hashing)
                    args: [8, 72], 
                    msg: 'La contraseña debe tener entre 8 y 72 caracteres.'
                },
                // 3. Bloquea espacios en blanco (internos y externos)
                notContains: {
                    args: ' ',
                    msg: 'La contraseña no debe contener espacios en blanco.'
                }
            }
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                is: {
                    args: /^[0-9\s\-\(\)]+$/, 
                    msg: 'El formato del número de teléfono no es válido.'
                },
                len: {
                    args: [7, 20],
                    msg: 'El número de teléfono debe tener entre 7 y 20 caracteres.'
                }
            }
        },
        birth_date: {
            type: DataTypes.DATEONLY,
            allowNull: true,
            validate: {
                isDate: {
                    msg: 'El valor debe ser una fecha válida (YYYY-MM-DD).'
                },
                // Opcional: Evita que el usuario ponga una fecha en el futuro
                isBefore: {
                    args: new Date().toISOString().split('T')[0], // Usa la fecha de hoy
                    msg: 'La fecha de nacimiento no puede ser una fecha futura.'
                }
            }
        },
        image_user_url: {
            type: DataTypes.TEXT,
            allowNull: true,
            validate: {
                notEmpty: {
                    msg: 'La url de la foto del usuario no puede ser vacía'
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
        status: {
            type: DataTypes.ENUM('active','inactive','banned'),
            allowNull: false,
            defaultValue: 'active',
            validate: {
                notEmpty: {
                    msg: 'El status del usuario no puede ser vacío'
                },
                // 2. Opcional: Validación explícita de inclusión (aunque ENUM ya lo hace a nivel de DB)
                isIn: {
                    args: [['active','inactive','banned']],
                    msg: 'Estado no válido. Debe ser uno de: active, inactive, banned'
                }
            }
        },
        role_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {

        timestamps: true, 
        tableName: 'users', 
        underscored: true,
        freezeTableName: true

    }

);

    module.exports = User;