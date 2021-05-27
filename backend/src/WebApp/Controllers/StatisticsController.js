const express = require('express');

const StatisticsRepository = require('../../Infrastructure/PostgreSQL/Repository/StatisticsRepository.js');
const AuthorizationFilter = require('../Filters/AuthorizationFilter.js');
const { authorizeAndExtractTokenAsync } = require("../Filters/JWTFilter.js");
const ResponseFilter = require('../Filters/ResponseFilter.js');
const RoleConstants = require("../Constants/Roles.js");
const Router = express.Router();


Router.get('/registers', authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles(RoleConstants.ADMIN), async (req, res) => {

    console.log("Getting registers statistics...");
    const registers = await StatisticsRepository.getRegistersByDayAsync();
    ResponseFilter.setResponseDetails(res, 200, registers);
});

Router.get('/logins', authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles(RoleConstants.ADMIN), async (req, res) => {

    console.log("Getting logins statistics...");
    const logins = await StatisticsRepository.getLoginsByDayAsync();
    ResponseFilter.setResponseDetails(res, 200, logins);
});

Router.get('/forum', authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles(RoleConstants.SUPPORT), async (req, res) => {

    console.log("Getting forum statistics...");
    const forum = await StatisticsRepository.getPostsByDayAsync();
    ResponseFilter.setResponseDetails(res, 200, forum);
});

Router.get('/transactions', authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles(RoleConstants.ADMIN), async (req, res) => {

    console.log("Getting transactions statistics...");
    const transactions = await StatisticsRepository.getTransactionsByDayAsync();
    ResponseFilter.setResponseDetails(res, 200, transactions);
});

Router.get('/transactions/:id', authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles(RoleConstants.USER), async (req, res) => {

    let {id} = req.params;
    id = parseInt(id);

    console.log("Getting transactions statistics...");
    const transactions = await StatisticsRepository.getUserTransactionsByDayAsync(id);
    ResponseFilter.setResponseDetails(res, 200, transactions);
});

module.exports = Router;