const UsersRepository = require('../../Infrastructure/PostgreSQL/Repository/UsersRepository.js');
const AuthenticatedUserDto = require('../DTOs/AuthenticatedUserDto.js');
const RegisteredUserDto = require('../DTOs/RegisteredUserDto.js');
const JwtPayloadDto = require('../DTOs/JwtPayloadDto.js');
const ServerError = require('../../WebApp/Models/ServerError');

const { hashPassword, comparePlainTextToHashedPassword } = require('../Security/Password')
const { generateTokenAsync } = require('../Security/Jwt');

const authenticateAsync = async (username, plainTextPassword) => {

    console.info(`Authenticates user with username ${username}`);

    const user = await UsersRepository.getByUsernameWithRoleAsync(username);
    
    if (!user) {
        throw new ServerError(`Utilizatorul cu username ${username} nu exista in sistem!`, 404);
    }

    /**
     * TODO
     * 
     * pas 1: verifica daca parola este buna (hint: functia compare)
     * pas 1.1.: compare returneaza true sau false. Daca parola nu e buna, arunca eroare
     * pas 2: genereaza token cu payload-ul JwtPayload
     * pas 3: returneaza AuthenticatedUserDto
     */

    const payload = new JwtPayloadDto(user.id, user.role);
    const cmp_ret = await comparePlainTextToHashedPassword(plainTextPassword, user.password);

    if (cmp_ret === false || !cmp_ret) {
        throw new ServerError(`Parola introdusa nu este corecta pentru userul ${username}!`, 404);
    } else {

        // generam token-ul
        const token = await generateTokenAsync(payload);


        /*if (!res) {
            throw new ServerError(`Error while signing in, token problems. Please try again.`, 404);
        }*/

        return new AuthenticatedUserDto(user.id, token, user.role);
    }
    
};

const registerAsync = async (username, plainTextPassword, email, balance, role_id, verified, register_time) => {
    /**
     * TODO
     * 
     * pas 1: cripteaza parola
     * pas 2: adauga (username, parola criptata) in baza de date folosind UsersRepository.addAsync
     * pas 3: returneaza RegisteredUserDto
     * 
     */

    const crypted_pass = await hashPassword(plainTextPassword);
    const user = await UsersRepository.addAsync(username, crypted_pass, email, balance, role_id, verified, register_time);
    return new RegisteredUserDto(user.id, user.username, user.role_id);
};

const encryptPassword = async (plainTextPassword) => {

    const crypted_pass = await hashPassword(plainTextPassword);
    return crypted_pass;
}

module.exports = {
    authenticateAsync,
    registerAsync,
    encryptPassword
}