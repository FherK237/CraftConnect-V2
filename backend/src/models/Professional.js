const { DataTypes } = require('sequelize');
const Sequelize = require('../config/database');

    const Professional = Sequelize.define('Professional', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true, 
            autoIncrement: true
        },
        firstname: {
            type: DataTypes.STRING, 
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'El nombre del profesional no puede ser vacío'
                }, 
                min: {
                    args: [3],
                    msg: 'El nombre del profesional debe tener por lo menos 3 caracteres.'
                }, 
                max: {
                    args: [100], 
                    msg: 'El nombre del profesional no debe tener mas de 100 caracteres.'
                }
            }
        },
        lastname: {
            type: DataTypes.STRING, 
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Los apeliidos del profesional no puede ser vacío'
                }, 
                min: {
                    args: [3],
                    msg: 'Los apeliidos del profesional debe tener por lo menos 3 caracteres.'
                }, 
                max: {
                    args: [100], 
                    msg: 'Los apeliidos del profesional no debe tener mas de 100 caracteres.'
                }
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: {
                    msg: 'El correo del profesional no debe ser vacio'
                },
                isEmail: {
                    msg: 'Debe ser un correo válido'
                },
                min: {
                    args: [5],
                    msg: 'El correo debe por lo menos tener 5 caracteres'
                },
                // max: {
                //     args: [255],
                //     msg: 'El correo no debe exceder los 150 caracteres'
                // }
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
            notEmpty: {
                msg: 'La contraseña del profesional no puede ser vacía.'
            },
            len: {
                args: [8, 255],
                msg: 'La contraseña del profesional debe tener al menos 8 caracteres.',
            },
        }
        },
        failedAttempts: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false
        },
        lockUntil: {
            type: DataTypes.DATE,
            allowNull: true
        },
        is_verified: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
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
        picture: {
            type: DataTypes.TEXT,
            allowNull: true,
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
        company_name: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                min: {
                    args: [3],
                    msg: 'El nombre de la compañia por lo menos debe tener 3 caracteres'
                },
                max: {
                    args: [100],
                    msg: 'El nombre de la compañia no puede exceder los 100 caracteres'
                }
            }
        }, 
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        experience_years: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                isInt: {
                    msg: 'Los años de experiencia deben ser un número entero.'
                },
                min: {
                    args: [0],
                    msg: 'El mínimo de años de experiencia es 0.'
                },
                max: {
                    args: [50],
                    msg: 'El máximo de años de experiencia no debe exceder de 50.'
                }
            }
        },
        image_ine_front: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        image_ine_back: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        latitude: {
            type: DataTypes.DECIMAL(10, 8),
            allowNull: true,
            validate: {
                isDecimal: {
                    msg: 'La latitud debe ser un valor decimal válido.'
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
            allowNull: true,
            validate: {
                isDecimal: {
                    msg: 'La longitud debe ser un valor decimal válido.'
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
            defaultValue: 'active', // ✅ Con esto, nunca será vacío
             validate: {
                // 💡 ELIMINA notEmpty AQUÍ.
                isIn: {
                    args: [['active','inactive','banned']],
                    msg: 'Estado no válido. Debe ser uno de: active, inactive, banned'
                }
            }
        },
        role: {
            type: DataTypes.ENUM('user', 'professional'),
            defaultValue: 'professional',
            allowNull: false
        },
        job_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        resetToken: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        resetTokenExpiry: {
            type: DataTypes.DATE,
            allowNull: true,
        },

        status: {
            type: DataTypes.ENUM('active', 'inactive', 'banned'),
            defaultValue: 'active',
        },
        //  CAMPO PARA DISPONIBILIDAD DE TRABAJO
        is_available: {
            type: DataTypes.BOOLEAN, // BOOLEAN para mapear TINYINT(1)
            allowNull: false,
            defaultValue: true, // Por defecto, el Fixer está disponible
            comment: 'Estado de disponibilidad para recibir trabajos: 0=Ocupado, 1=Disponible'
        },
        
    }, {

        timestamps: true, 
        tableName: 'professionals', 
        underscored: true,
        freezeTableName: true

    }
);

    module.exports = Professional;