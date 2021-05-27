const express = require("express");

const { authorizeAndExtractTokenAsync } = require("../Filters/JWTFilter.js");

const UsersManager = require("../../WebCore/Managers/UsersManager.js");
const UsersRepository = require("../../Infrastructure/PostgreSQL/Repository/UsersRepository.js");
const StatisticsRepository = require("../../Infrastructure/PostgreSQL/Repository/StatisticsRepository");
const TransactionsRepository = require("../../Infrastructure/PostgreSQL/Repository/TransactionsRepository");
const ForumRepository = require("../../Infrastructure/PostgreSQL/Repository/ForumPostsRepository");
const {sendConfirmationEmail} = require("./mailer");

const {
  UserRegisterBody,
  UserLoginBody,
  UserRegisterResponse,
  UserLoginResponse,
  UserResponse,
} = require("../Models/Users.js");

const ResponseFilter = require("../Filters/ResponseFilter.js");
const AuthorizationFilter = require("../Filters/AuthorizationFilter.js");
const RoleConstants = require("../Constants/Roles.js");

const Router = express.Router();

// Test database connection
Router.get("/test", async (req, res) => {
  const users = await UsersRepository.getAllAsync();
  ResponseFilter.setResponseDetails(
    res,
    200,
    users.map((user) => new UserRegisterResponse(user))
  );
});

// get user info by id
Router.get(
  "/:userId",
  authorizeAndExtractTokenAsync,
  AuthorizationFilter.authorizeRoles(RoleConstants.USER),
  async (req, res) => {
    let { userId } = req.params;

    console.info(`User Id in UserController is ${userId}`);

    userId = parseInt(userId);

    console.info(`User Id 2 in UserController is ${userId}`);

    const user = await UsersRepository.getUserById(userId);
    ResponseFilter.setResponseDetails(res, 200, new UserResponse(user));
  }
);

// delete user by id
Router.delete(
  "/:userId",
  authorizeAndExtractTokenAsync,
  AuthorizationFilter.authorizeRoles(RoleConstants.ADMIN),
  async (req, res) => {
    let { userId } = req.params;

    console.info(`User Id in UserController is ${userId}`);

    userId = parseInt(userId);

    // first delete user from transactions table
    const transacDeleteResult = await TransactionsRepository.deleteTransactionAsync(userId);

    // delete user's forum posts
    const forumDeleteResult = await ForumRepository.deletePostsByUserIdAsync(userId);

    // finally, delete the user
    const user = await UsersRepository.deleteUserById(userId);
    ResponseFilter.setResponseDetails(res, 200, user);
  }
);

// update user's info
Router.put(
  "/:userId",
  authorizeAndExtractTokenAsync,
  AuthorizationFilter.authorizeRoles(RoleConstants.USER),
  async (req, res) => {
    let { userId } = req.params;
    console.info(`User Id in UserController is ${userId}`);

    userId = parseInt(userId);
    let user = null;

    console.log(req.body.amount);

    // if it's an user's account update
    if (req.body.amount === undefined) {
      const username = req.body.username;
      const email = req.body.email;

      user = await UsersRepository.updateUserById(
        userId,
        username,
        email
      );

    } else {

        console.log("updating balance");
        // it's an user's deposit update
        user = await UsersRepository.updateUserBalanceById(
            userId,
            parseInt(req.body.amount)
          );
    }

    ResponseFilter.setResponseDetails(res, 200, new UserResponse(user));
  }
);

Router.post("/register", async (req, res) => {
  const userBody = new UserRegisterBody(req.body);

  const checkUsernameAlreadyExists = await UsersRepository.checkUsernameAlreadyExists(userBody.Username);

  if (checkUsernameAlreadyExists.length != 0) {
    ResponseFilter.setResponseDetails(res, 200, "This username already exists");
    return;
  }

  const checkEmailAlreadyExists = await UsersRepository.checkEmailAlreadyExists(userBody.Email);
  if (checkEmailAlreadyExists.length != 0) {
    ResponseFilter.setResponseDetails(res, 200, "This email already exists");
    return;
  }

  const currentDate = new Date()
      .toISOString()
      .replace(/T/, " ")
      .replace(/\..+/, "");

  const user = await UsersManager.registerAsync(
    userBody.Username,
    userBody.Password,
    userBody.Email,
    userBody.Balance,
    userBody.RoleId,
    userBody.Verified,
    currentDate
  );

  const user_id = await UsersRepository.getUserByUsername(userBody.Username);
  
  await sendConfirmationEmail(userBody, user_id.id);

  const registers = await StatisticsRepository.addRegisterAsync(userBody.Username, currentDate);

  ResponseFilter.setResponseDetails(res, 201, new UserRegisterResponse(user));
});

// activate user's account
Router.get('/activate/:userId', async (req, res) => {

  let { userId } = req.params;

  const resActivation = await UsersRepository.activationLinkExpired(userId);
  console.log(resActivation.expired);

  /*if (resActivation.expired === true) {
    console.log("da");
    ResponseFilter.setResponseDetails(res, 200, "Activation link expired");
    return;
  }*/

  const activateRes = await UsersRepository.activateAccountById(userId);

  ResponseFilter.setResponseDetails(res, 200, "Account has been activated");
});

// login user
Router.post("/login", async (req, res) => {
  const userBody = new UserLoginBody(req.body);

  // check if the account is verified
  const checkUser = await UsersRepository.getUserByUsername(userBody.Username);

  if (checkUser.verified === false) {
    ResponseFilter.setResponseDetails(res, 200, "not activated");
    return;
  }

  const userDto = await UsersManager.authenticateAsync(
    userBody.Username,
    userBody.Password
  );
  const user = new UserLoginResponse(userDto.Id, userDto.Token, userDto.Role);

  const currentDate = new Date()
      .toISOString()
      .replace(/T/, " ")
      .replace(/\..+/, "");

  const logins = await StatisticsRepository.addLoginAsync(userBody.Username, currentDate);

  ResponseFilter.setResponseDetails(res, 200, user);
});

// get all users
Router.get(
  "/",
  authorizeAndExtractTokenAsync,
  AuthorizationFilter.authorizeRoles(RoleConstants.ADMIN),
  async (req, res) => {
    const users = await UsersRepository.getAllAsync();

    ResponseFilter.setResponseDetails(res, 200, users);
  }
);

Router.put(
  "/:userId/role/:roleId",
  authorizeAndExtractTokenAsync,
  AuthorizationFilter.authorizeRoles(RoleConstants.ADMIN),
  async (req, res) => {
    let { userId, roleId } = req.params;

    userId = parseInt(userId);
    roleId = parseInt(roleId);

    const user = await UsersRepository.updateUserbyRoleId(userId, roleId);

    if (!user) {
      throw new ServerError(`User with id ${userId} does not exist!`, 404);
    }

    ResponseFilter.setResponseDetails(res, 201, new UserRegisterResponse(user));
  }
);

module.exports = Router;
