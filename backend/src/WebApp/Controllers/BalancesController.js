const express = require('express');

const {
    authorizeAndExtractTokenAsync
} = require('../Filters/JWTFilter.js');

const BalancesRepository = require('../../Infrastructure/PostgreSQL/Repository/BalancesRepository.js');

const {
    BalanceBody,
    BalanceResponse
} = require ('../Models/Balances.js');

const ResponseFilter = require('../Filters/ResponseFilter.js');
const AuthorizationFilter = require('../Filters/AuthorizationFilter.js');
const RoleConstants = require('../Constants/Roles.js');

const Router = express.Router();

/* Get the balance for a user based on his id */
Router.get('/:userId', async (req, res) => {

    let {userId} = req.params;
    userId = parseInt(userId);

    const balance = await BalancesRepository.getBalanceByUserIdAsync(userId);

    ResponseFilter.setResponseDetails(res, 200, balance);

});

/* Deposit money for a user based on his id */
Router.put('/deposit/:userId', async (req, res) => {


    let {userId} = req.params;
    userId = parseInt(userId);

    balanceBody = new BalanceBody(req.body);

    const user = await BalancesRepository.depositMoneyAsync(userId, balanceBody.Amount);
    const userResponse = new BalanceResponse(user);

    ResponseFilter.setResponseDetails(res, 200, userResponse);
});

/* Withdraw money for a user based on his id */
Router.put('/withdraw/:userId', async (req, res) => {


    let {userId} = req.params;
    userId = parseInt(userId);

    balanceBody = new BalanceBody(req.body);

    const user = await BalancesRepository.withdrawMoneyAsync(userId, balanceBody.Amount);
    const userResponse = new BalanceResponse(user);

    ResponseFilter.setResponseDetails(res, 200, userResponse);
});

module.exports = Router;