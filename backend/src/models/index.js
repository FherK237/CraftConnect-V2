const Sequelize = require('../config/database');

    // ==========================
    // M O D E L O S
    // ==========================
    const User = require('./User');
    const Professional = require('./Professional');
    const Category = require('./Category');
    const Service = require('./Service');
    const Schedule = require('./Schedule');
    const Contract = require('./Contract');
    const Review = require('./Review');
    const Comission = require('./Comission');
    const Portfolio = require('./Portfolio');


    const Conversation = require('./Conversation');
    const Notification = require('./Notification');
    const RevokedToken = require('./RevokedToken');


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
    // comission ↔ Services (1:N)
    // ==========================
    Comission.hasMany(Service, { foreignKey: 'comission_id', as: 'services' });
    Service.belongsTo(Comission, { foreignKey: 'comission_id', as: 'Comission' });


    // ==========================
    // EXPORTAR MODELOS
    // ==========================
    module.exports = {
        User,
        Professional,
        Category,
        Service,
        Schedule,
        Contract,
        Comission,
        Review,
        Portfolio,
        Conversation,
        Notification,
        RevokedToken,
        Sequelize
    };
