const express = require("express");

const { authorizeAndExtractTokenAsync } = require("../Filters/JWTFilter.js");

const TransactionsRepository = require("../../Infrastructure/PostgreSQL/Repository/TransactionsRepository.js");
const UsersRepository = require("../../Infrastructure/PostgreSQL/Repository/UsersRepository.js");

const {
  TransactionBody,
  TransactionResponse,
} = require("../Models/Transactions.js");

const ResponseFilter = require("../Filters/ResponseFilter.js");
const AuthorizationFilter = require("../Filters/AuthorizationFilter.js");
const RoleConstants = require("../Constants/Roles.js");

const Router = express.Router();

/* Get all transactions for a certain user based on his id */
Router.get(
  "/:userId",
  authorizeAndExtractTokenAsync,
  AuthorizationFilter.authorizeRoles(RoleConstants.USER),
  async (req, res) => {
    let { userId } = req.params;

    userId = parseInt(userId);

    const transactions = await TransactionsRepository.getAllByUserIdAsync(
      userId
    );

    ResponseFilter.setResponseDetails(res, 200, transactions);
  }
);

/* Create a new transaction from user1 (sender_id) to user2 (receiver_id) */
Router.post(
  "/:senderId",
  authorizeAndExtractTokenAsync,
  AuthorizationFilter.authorizeRoles(RoleConstants.USER),
  async (req, res) => {
    let { senderId } = req.params;

    const receiverName = req.body.receiver_name; 
    senderId = parseInt(senderId);
    const receiver = await UsersRepository.getUserByUsername(receiverName);
    const receiverId = parseInt(receiver.id);

    const currentDate = new Date()
      .toISOString()
      .replace(/T/, " ")
      .replace(/\..+/, "");

    const transactionBody = new TransactionBody(req.body);
    const transaction = await TransactionsRepository.createTransactionAsync(
      senderId,
      receiverId,
      transactionBody.Amount,
      currentDate
    );

    const transactionResponse = new TransactionResponse(
      senderId,
      receiverId,
      transactionBody.Amount,
      currentDate
    );
    ResponseFilter.setResponseDetails(res, 200, transactionResponse);
  }
);

module.exports = Router;
