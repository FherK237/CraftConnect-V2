const { Router } = require('express');

    const router = Router();

    router.use('/auth', require('./auth.routes'));
    router.use('/profile', require('./profile.route'));

    module.exports = router;