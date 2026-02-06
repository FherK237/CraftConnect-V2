const { Router } = require('express');

    const router = Router();

    router.use('/auth', require('./auth.routes'));
    router.use('/profile', require('./profile.route'));
    router.use('/fixer', require('./professional.route')); //CAMBIAR RUTA DENTRO DE /PROFILE, O /ACCOUNT
    router.use('/chatBot', require('./chatBot.routes'));
    // router.use('/user', require('./user.route'));
    router.use('/contracts', require('./contract.route'));
    router.use('/jobs', require('./jobs.routes'))
    router.use('/fixers', require('./fixers.routes'))

    module.exports = router;