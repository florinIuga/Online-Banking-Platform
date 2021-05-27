const {
    queryAsync
} = require('..');

const getAllAsync = async() => {
    console.info ('Getting all users from database');
    
    return await queryAsync('SELECT u.id AS id, u.username AS username, u.email as email, r.value AS role FROM users u INNER JOIN roles r ON u.role_id = r.id ORDER BY u.username ASC');
};

const addAsync = async (username, password, email, balance, role_id, verified, register_date) => {
    console.info(`Adding user ${username}`);

    const users = await queryAsync('INSERT INTO users (username, password, email, balance, role_id, verified, register_date) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', 
    [username, password, email, balance, role_id, verified, register_date]);

    return users[0];
};

const getUserByUsername = async (username) => {

    console.info(`Getting user with username ${username}`);
    const users = await queryAsync(`SELECT 
                                            u.id,
                                            u.email, 
                                            u.password,
                                            u.verified
                                    FROM users u
                                    WHERE u.username = $1`, [username]);

    return users[0];
};

const getUserById = async (id) => {

    console.info(`Getting user with id ${id}`);
    const users = await queryAsync(`SELECT 
                                            u.id,
                                            u.balance,
                                            u.username,
                                            u.email, 
                                            u.password
                                    FROM users u
                                    WHERE u.id = $1`, [id]);

    return users[0];
};

const deleteUserById = async (id) => {

    console.info(`Deleting user with id ${id}`);
    const users = await queryAsync(`DELETE 
                                    FROM users u
                                    WHERE u.id = $1`, [id]);

    return users[0];
};

const getByUsernameWithRoleAsync = async (username) => {
    console.info(`Getting user with username ${username}`);
    
    const users = await queryAsync(`SELECT u.id, u.password, 
                                u.username, r.value as role,
                                r.id as role_id FROM users u 
                                JOIN roles r ON r.id = u.role_id
                                WHERE u.username = $1`, [username]);
    return users[0];
};

const updateUserbyRoleId = async (id, role_id) => {
    console.info(`Giving role to user with id ${id}`);

    const users = await queryAsync(`UPDATE users SET role_id = $1 WHERE id = $2 RETURNING *`, [role_id, id]);
    return users[0];
};

const updateUserById = async (id, username, email) => {
    console.info(`Updating user with id ${id}`);

    const users = await queryAsync(`UPDATE users SET username = $2, email = $3 WHERE id = $1 RETURNING *`, [id, username, email]);
    return users[0];
};

const updateUserBalanceById = async (id, amount) => {
    console.info(`Updating user with id ${id}`);

    const users = await queryAsync(`UPDATE users SET balance = balance + $2 WHERE id = $1 RETURNING *`, [id, amount]);
    return users[0];
};

const checkUsernameAlreadyExists = async (username) => {

    console.info("Searching for users with the same username in order to validate");

    const users = await queryAsync(`SELECT id FROM users WHERE username = $1`, [username]);
    return users;
};

const checkEmailAlreadyExists = async (email) => {

    console.info("Searching for users with the same email in order to validate");

    const users = await queryAsync(`SELECT id FROM users WHERE email = $1`, [email]);
    return users;
};

const activateAccountById = async (id) => {

    console.info("Activating user account...");
    const res = await queryAsync(`UPDATE users SET verified = true WHERE id = $1 RETURNING *`, [id]);

    return res;
};

const activationLinkExpired = async (id) => {
    console.info("Checking whether the link expired or not...");

    const res = await queryAsync(`SELECT (current_timestamp > register_date + interval '15 min') as expired FROM users WHERE id = $1`, [id]);

    return res[0];
};

module.exports = {
    getAllAsync,
    addAsync,
    getByUsernameWithRoleAsync,
    updateUserbyRoleId,
    getUserById,
    getUserByUsername,
    deleteUserById,
    updateUserById,
    updateUserBalanceById,
    checkUsernameAlreadyExists,
    checkEmailAlreadyExists,
    activateAccountById,
    activationLinkExpired
}