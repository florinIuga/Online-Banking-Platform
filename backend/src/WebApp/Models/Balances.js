const ServerError = require('./ServerError.js');

class BalanceBody {

    constructor(body) {

        if (!body.amount) {
            throw new ServerError("Amount is missing", 400);
        }

        this.amount = body.amount;
    }

    get Amount() {
        return this.amount;
    }
}

class BalanceResponse {

    constructor(user) {
        this.username = user.username;
        this.id = user.id;
        this.balance = user.balance;
    }
}

module.exports = {
    BalanceBody,
    BalanceResponse
}