const ServerError = require('./ServerError.js');

class TransactionBody {

    constructor(body) {

        if (!body.amount) {
            throw new ServerError("Amount is missing", 400);
        }

        this.amount = parseInt(body.amount);
    }

    get Amount() {
        return this.amount;
    }

}

class TransactionResponse {

    constructor(senderId, receiverId, amount, date) {
        this.id_sender = senderId;
        this.id_receiver = receiverId;
        this.amount = amount;
        this.date = date;
    }
}

module.exports = {
    TransactionBody,
    TransactionResponse
}