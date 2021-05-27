const ServerError = require('./ServerError.js');

class UserRegisterBody {
    constructor (body) {

        if (!body.email) {
            throw new ServerError("Email is missing", 400);
        }

        if (!body.username) {
            throw new ServerError("Username is missing", 400);
        }
    
        if (!body.password) {
            throw new ServerError("Password is missing", 400);
        }

        if (body.password.length < 4) {
            throw new ServerError("Password is too short!", 400);
        }

        this.username = body.username;
        this.password = body.password;
        this.email = body.email;
        this.balance = 0;
        this.roleId = 3;
        this.verified = false;
    }

    get Username () {
        return this.username;
    }

    get Password () {
        return this.password;
    }

    get Balance () {
        return this.balance;
    }

    get Email() {
        return this.email;
    }

    get RoleId () {
	    return this.roleId;
    }

    get Verified () {
        return this.verified;
    }

}

class UserLoginBody {

    constructor(body) {

        if (!body.username) {
            throw new ServerError("Username is missing", 400);
        }
    
        if (!body.password) {
            throw new ServerError("Password is missing", 400);
        }

        this.username = body.username;
        this.password = body.password;
    }

    get Username () {
        return this.username;
    }

    get Password () {
        return this.password;
    }
}

class UserRegisterResponse {
    constructor(user) {
        this.username = user.username;
        this.id = user.id;
        this.roleId = user.role_id;
    }
}

class UserLoginResponse {
    constructor(id, token, role) {
        this.id = id;
        this.role = role;
        this.token = token;
    }
}

class UserResponse {
    constructor(user) {
        this.username = user.username;
        this.id = user.id;
        this.email = user.email;
        this.password = user.password;
        this.roleId = user.role_id;
        this.balance = user.balance;
    }
}

module.exports =  {
    UserRegisterBody,
    UserLoginBody,
    UserLoginResponse,
    UserRegisterResponse,
    UserResponse
}
