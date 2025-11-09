const { Router } = require('express');

    const router = Router();

    router.use('/auth', require('./auth.routes'));
    router.use('/profile', require('./profile.route'));
    router.use('/professional', require('./professional.route'));
    router.use('/chatBot', require('./chatBot.routes'));

    module.exports = router;