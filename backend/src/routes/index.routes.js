const { Router } = require('express');

    const router = Router();

    router.use('/auth', require('./auth.routes'));
    router.use('/profile', require('./profile.route'));
    router.use('/fixer', require('./professional.route'));
    router.use('/chatBot', require('./chatBot.routes'));
    router.use('/user', require('./user.route'));
    router.use('/contracts', require('./contract.route'));

    module.exports = router;