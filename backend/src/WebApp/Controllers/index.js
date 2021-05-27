const Router = require('express').Router();

const {
    authorizeAndExtractTokenAsync
} = require('../Filters/JWTFilter.js');


/**
 * TODO import controllers
 */

const UsersController = require('./UsersController.js');
const RolesController = require('./RolesController.js');
const TransactionsController = require('./TransactionsController.js');
const BalancesController = require('./BalancesController.js');
const AccountSettingsController = require('./AccountSettingsController.js');
const ForumPostsController = require('./ForumPostsController.js');
const StatisticsController = require('./StatisticsController');

/**
 * TODO add controllers to main router
 */

Router.use('/v1/roles', authorizeAndExtractTokenAsync, RolesController);
Router.use('/v1/transactions', TransactionsController);
Router.use('/v1/balances', BalancesController);
Router.use('/v1/account', AccountSettingsController);
Router.use('/v1/forum', ForumPostsController);
Router.use('/v1/statistics', StatisticsController);
Router.use('/v1', UsersController);

module.exports = Router;