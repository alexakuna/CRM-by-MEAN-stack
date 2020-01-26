const express = require('express');
const controller = require('../controlers/analytics');
const router = express.Router();
const passport = require('passport');


router.get('/analytics', passport.authenticate('jwt', {session: false}), controller.analytics);
router.get('/overview', passport.authenticate('jwt', {session: false}), controller.overview);

module.exports = router;
