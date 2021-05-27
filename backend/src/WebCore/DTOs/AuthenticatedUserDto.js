class AuthenticatedUserDto {
    constructor (id, token, role) {
        this.token = token;
        this.role = role;
        this.id = id;
    }

    get Token() {
        return this.token;
    }

    get Role() {
        return this.role;
    }

    get Id() {
        return this.id;
    }
}

module.exports = AuthenticatedUserDto;