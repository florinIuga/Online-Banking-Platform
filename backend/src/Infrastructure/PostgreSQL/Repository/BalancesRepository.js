const {
    queryAsync
} = require('..');

const getBalanceByUserIdAsync = async (user_id) => {

    console.info(`Getting balance for user: ${user_id}`);

    const transactions = await queryAsync(`SELECT u.balance as balance
                                            FROM users u WHERE u.id = $1`, [user_id]);
    return transactions[0];
};

const depositMoneyAsync = async (user_id, amount) => {

    console.info(`Deposit money for user: ${user_id}`);

    const deposit = await queryAsync(`UPDATE users SET balance = balance + $2
                                            WHERE id = $1 RETURNING *`, [user_id, amount]);
    return deposit[0];
};

const withdrawMoneyAsync = async (user_id, amount) => {
    console.info(`Withdraw money for user: ${user_id}`);

    const withdraw = await queryAsync(`UPDATE users SET balance = balance - $2
                                            WHERE id = $1 RETURNING *`, [user_id, amount]);
    return withdraw[0];
};

module.exports = {
    getBalanceByUserIdAsync,
    depositMoneyAsync,
    withdrawMoneyAsync 
}