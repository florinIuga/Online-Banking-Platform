const express = require('express');

const {
    authorizeAndExtractTokenAsync
} = require('../Filters/JWTFilter.js');

const AccountSettingsRepository = require('../../Infrastructure/PostgreSQL/Repository/AccountSettingsRepository.js');
const TransactionsRepository = require('../../Infrastructure/PostgreSQL/Repository/TransactionsRepository.js');
const ForumPostsRepository = require('../../Infrastructure/PostgreSQL/Repository/ForumPostsRepository.js');
const UsersRepository = require('../../Infrastructure/PostgreSQL/Repository/UsersRepository.js');
const UsersManager = require('../../WebCore/Managers/UsersManager.js');
const ResponseFilter = require('../Filters/ResponseFilter.js');
const AuthorizationFilter = require('../Filters/AuthorizationFilter.js');
const RoleConstants = require('../Constants/Roles.js');

const Router = express.Router();

/* Update username */
Router.use('/username/:userId', async (req, res) => {

    let {userId} = req.params;
    userId = parseInt(userId);

    const newUsername = req.body.username;

    const user = await AccountSettingsRepository.updateUsernameAsync(userId, newUsername);
    ResponseFilter.setResponseDetails(res, 200, user);
});

/* Update password */
Router.use('/password/:userId', async (req, res) => {

    let {userId} = req.params;
    userId = parseInt(userId);

    const password = req.body.password;
    const encryptedPassword = await UsersManager.encryptPassword(password);

    const user = await AccountSettingsRepository.updatePasswordAsync(userId, encryptedPassword);
    ResponseFilter.setResponseDetails(res, 200, user);
});

/* Delete account - only the admin can do this */
Router.use('/:userId', async (req, res) => {

    let {userId} = req.params;
    userId = parseInt(userId);

    // First delete the transactions which include this account
    const resp = await TransactionsRepository.deleteTransactionAsync(userId);

    // Delete forum posts associated with this account
    const resp2 = await ForumPostsRepository.deletePostsByUserIdAsync(userId);

    // Delete tokens associated with this account
    const resp3 = await UsersRepository.deleteTokenByUserId(userId);

    const user = await AccountSettingsRepository.deleteAccountAsync(userId);
    ResponseFilter.setResponseDetails(res, 200, user);
});

module.exports = Router;