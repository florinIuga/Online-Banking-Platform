const {
    queryAsync
} = require('..');

const getAllByUserIdAsync = async (user_id) => {
    console.info(`Getting transaction history for user: ${user_id}`);
    
    const transaction_history = await queryAsync(
        `select
            sender_username, receiver_username, amount, transac_transfer_date_str, transac_transfer_date
            from (
        
            select
                sender.username as sender_username, receiver.username as receiver_username,
                transac.amount, to_char(transac.transfer_date, 'dd-mm-yyyy hh:mm:ss') as transac_transfer_date_str, transac.transfer_date as transac_transfer_date
            from
                transactions transac
                join users sender on transac.id_sender = sender.id
                join users receiver on transac.id_receiver = receiver.id
            where
                sender.id = $1
        
            union all
        
            select
                sender.username as sender_username, receiver.username as receiver_username,
                transac.amount, to_char(transac.transfer_date, 'dd-mm-yyyy hh:mm:ss') as transac_transfer_date_str, transac.transfer_date as transac_transfer_date
            from
                transactions transac
                join users sender on transac.id_sender = sender.id
                join users receiver on transac.id_receiver = receiver.id
            where
        
                receiver.id = $1
    ) a
    order by
        transac_transfer_date desc`, [user_id]);

    return transaction_history;
};

const createTransactionAsync = async (id_sender, id_receiver, amount, date) => {

    console.info(`Create transaction from user: ${id_sender} to user: ${id_receiver}`);

    const transactions = await queryAsync(`INSERT INTO transactions 
                                            (id_sender, id_receiver, amount, transfer_date)
                                            VALUES ($1, $2, $3, $4) RETURNING id_sender, id_receiver, amount`,
                                            [id_sender, id_receiver, amount, date]);
    
    // update the balance for both sender and receiver
    const updateSender = await queryAsync(`UPDATE users SET balance = balance - $2 WHERE id = $1`, [id_sender, amount]);
    const updateReceiver = await queryAsync(`UPDATE users SET balance = balance + $2 WHERE id = $1`, [id_receiver, amount]);
                                      
    return transactions[0];
};

const deleteTransactionAsync = async (deletedUserId, next) => {

    const transactions = await queryAsync(`DELETE FROM transactions WHERE id_sender = $1 OR id_receiver = $1`, [deletedUserId]);
    return transactions[0];
}

module.exports = {
    getAllByUserIdAsync,
    createTransactionAsync,
    deleteTransactionAsync
}