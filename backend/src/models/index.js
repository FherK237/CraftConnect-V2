const Sequelize = require('../config/database');

    // ==========================
    // M O D E L O S
    // ==========================
    const User = require('./User');
    const Professional = require('./Professional');
    const Role = require('./Role');
    const Permission = require('./Permission');
    const Category = require('./Category');
    const Service = require('./Service');
    const Schedule = require('./Schedule');
    const Contract = require('./Contract');
    const Review = require('./Review');
    const Comission = require('./Comission');
    const Portfolio = require('./Portfolio');


    const Conversation = require('./Conversation');
    const Notification = require('./Notification');

    // Modelo intermedio
    const RolePermission = require('./RolePermission');

    // ==========================
    // Roles ↔ Users / Professionals
    // ==========================
    User.belongsTo(Role, { foreignKey: 'role_id', as: 'role' });
    Role.hasMany(User, { foreignKey: 'role_id', as: 'users' });

    Professional.belongsTo(Role, { foreignKey: 'role_id', as: 'role' });
    Role.hasMany(Professional, { foreignKey: 'role_id', as: 'professionals' });

    // ==========================
    // Roles ↔ Permissions (Many-to-Many)
    // ==========================
    Role.belongsToMany(Permission, {
        through: RolePermission,
        foreignKey: 'role_id',
        otherKey: 'permission_id',
        as: 'permissions'
    });

    Permission.belongsToMany(Role, {
        through: RolePermission,
        foreignKey: 'permission_id',
        otherKey: 'role_id',
        as: 'roles'
    });

    // ==========================
    // Professionals ↔ Schedules (1:N)
    // ==========================
    Professional.hasMany(Schedule, { foreignKey: 'professional_id', as: 'schedules' });
    Schedule.belongsTo(Professional, { foreignKey: 'professional_id', as: 'professional' });

    // ==========================
    // Contracts ↔ Users / Professionals / Services
    // ==========================
    Professional.hasMany(Contract, { foreignKey: 'professional_id', as: 'contracts' });
    Contract.belongsTo(Professional, { foreignKey: 'professional_id', as: 'professional' });

    User.hasMany(Contract, { foreignKey: 'user_id', as: 'contracts' });
    Contract.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

    Service.hasMany(Contract, { foreignKey: 'service_id', as: 'contracts' });
    Contract.belongsTo(Service, { foreignKey: 'service_id', as: 'service' });

    // ==========================
    // Categories ↔ Services (1:N)
    // ==========================
    Category.hasMany(Service, { foreignKey: 'category_id', as: 'services' });
    Service.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

    // ==========================
    // Contract ↔ Review (1:N)
    // ==========================
    Contract.hasMany(Review, { 
        foreignKey: 'contract_id', 
        as: 'reviews' 
    });

    Review.belongsTo(Contract, { 
        foreignKey: 'contract_id', 
        as: 'contract' 
    });

    // ==========================
    // Contract ↔ Portfolio (1:1)
    // ==========================
    Contract.hasOne(Portfolio, { 
        foreignKey: 'contract_id', 
        as: 'portfolio'
    });

    Portfolio.belongsTo(Contract, { 
        foreignKey: 'contract_id', 
        as: 'contract'
    });

    // ==========================
    // Contract ↔ Portfolio (1:1)
    // ==========================

    Comission.hasMany(Contract, { 
        foreignKey: 'comission_id',
        as: 'contracts'
    });

    Contract.belongsTo(Comission, {
        foreignKey: 'comission_id',
        as: 'comissions'
    });

    // ==========================
    // EXPORTAR MODELOS
    // ==========================
    module.exports = {
        User,
        Professional,
        Role,
        Permission,
        Category,
        Service,
        Schedule,
        Contract,
        Review,
        Portfolio,
        Conversation,
        Notification,
        RolePermission,
        Sequelize
    };
