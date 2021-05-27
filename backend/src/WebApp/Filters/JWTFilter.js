const ServerError = require('../Models/ServerError.js');
const UsersRepository = require('../../Infrastructure/PostgreSQL/Repository/UsersRepository.js');

const {
    verifyAndDecodeDataAsync
} = require('../../WebCore/Security/Jwt');

const authorizeAndExtractTokenAsync = async (req, res, next) => {
    if (!req.headers.authorization) {
        throw new ServerError('Lipseste headerul de autorizare!', 401);
    }
    const token = req.headers.authorization.split(" ")[1];

    const decoded = await verifyAndDecodeDataAsync(token);

    const user_id = decoded.userId;
    console.info(`User Id in JWTFilter is: ${user_id}`);

    req.user = decoded;

    next();
};

module.exports = {
    authorizeAndExtractTokenAsync
}