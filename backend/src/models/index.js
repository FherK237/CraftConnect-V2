const Sequelize = require('../config/database');

    // ==========================
    // M O D E L O S
    // ==========================
    const User = require('./User');
    const Professional = require('./Professional');
    const Category = require('./Category');
    const Service = require('./Service');
    const Schedule = require('./Schedule');
    const Review = require('./Review');
    const Comission = require('./Comission');
    const Portfolio = require('./Portfolio');
    const Job = require('./Jobs');
    const PortfolioImage = require('./PortfolioImage');
    const ServiceImage = require('./ServiceImage');

    const Conversation = require('./Conversation');
    const Notification = require('./Notification');
    const RevokedToken = require('./RevokedToken');

    const Contract = require('./Contract');
    const ProfessionalService = require('./ProfessionalService');


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
    Job.hasMany(Professional, {foreignKey: 'job_id', as: "professionals"});
    Professional.belongsTo(Job, {foreignKey: 'job_id', as: 'job'})


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
    // comission ↔ contract (1:N)
    // ==========================
    Comission.hasMany(Contract, { foreignKey: 'comission_id', as: 'contracts' });
    Contract.belongsTo(Comission, { foreignKey: 'comission_id', as: 'Comission' });

    // ==========================|
    // service ↔ service_images (1:N)
    // ==========================

    Service.hasMany(ServiceImage, { foreignKey: 'service_id', as: 'service_images' });
    ServiceImage.belongsTo(Service, { foreignKey: 'service_id', as: 'service' });

    // ==========================
    // portfolio ↔ portfolio_images (1:N)
    // ==========================

    Portfolio.hasMany(PortfolioImage, { foreignKey: 'portfolio_id', as: 'portfolio_images' });
    PortfolioImage.belongsTo(Portfolio, { foreignKey: 'portfolio_id', as: 'portafolio' });

    // ==========================
    // professional ↔ professional_service / service ↔ professional_service (N:N)
    // ==========================

    Service.hasMany(ProfessionalService, { foreignKey: 'service_id', as: 'professional_service' });
    ProfessionalService.belongsTo(Service, { foreignKey: 'service_id', as: 'service' });

    Professional.hasMany(ProfessionalService, { foreignKey: 'professional_id', as: 'professional_service' });
    ProfessionalService.belongsTo(Professional, { foreignKey: 'professional_id', as: 'professional' });



    // ==========================
    // EXPORTAR MODELOS
    // ==========================
    module.exports = {
        Job,
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
        ProfessionalService,
        ServiceImage,
        PortfolioImage,
        Sequelize
    };
