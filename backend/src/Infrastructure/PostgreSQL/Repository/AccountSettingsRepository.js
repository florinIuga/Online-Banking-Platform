const {
    queryAsync
} = require('..');

const updateUsernameAsync = async (user_id, username) => {

    console.info(`Changing username for user: ${user_id}`);

    const users = await queryAsync(`UPDATE users SET username = $2 WHERE id = $1`, [user_id, username]);

    return users[0];
}

const updatePasswordAsync = async (user_id, encrypted_password) => {

    console.info(`Changing password for user: ${user_id}`);

    const users = await queryAsync(`UPDATE users SET password = $2 WHERE id = $1`, [user_id, encrypted_password]);

    return users[0];
}

const deleteAccountAsync = async (user_id) => {
    console.info(`Deleting user: ${user_id}`);

    const users = await queryAsync(`DELETE FROM users WHERE id = $1 RETURNING *`, [user_id])
    return users[0];
}

module.exports = {
    updateUsernameAsync,
    updatePasswordAsync,
    deleteAccountAsync
}