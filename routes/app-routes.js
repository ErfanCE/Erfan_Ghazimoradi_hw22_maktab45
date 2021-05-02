const express = require('express');
const router = express.Router();
const adminRoute = require('./admin-route');
const accountRoute = require('./account-route');
const exploreRoute = require('./explore-route');
const authenticationRoute = require('./authentication-route');
const authorization = require('../controllers/authorization-controller');
const access = require('../controllers/access-controller');


// root: blogger profile
router.get('/', (request, response) => response.redirect('/explore'));

// authentication
router.use('/authentication', authenticationRoute);

// admin route
router.use('/admin', authorization.profile, access.admin, adminRoute);

// account
router.use('/account', authorization.profile, accountRoute);

// explore
router.use('/explore', exploreRoute);


module.exports = router;