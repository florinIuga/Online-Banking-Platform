const ServerError = require('../Models/ServerError.js');

// observati cum in req exista obiectul user trimis la middlewareul anterior, de autorizare token
const authorizeRoles = (...roles) => {
    return (req, res, next) => {

        console.log(req.user);
        console.log(roles);

        for (let i = 0; i < roles.length; i++) {
            if (req.user.userRole === roles[i]) {
                    return next();
            }
        }
        throw new ServerError('Nu sunteti autorizat sa accesati resursa!', 403);
    }
};
 
module.exports = {
    authorizeRoles
}