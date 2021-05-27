

const nodemailer = require('nodemailer');

exports.sendConfirmationEmail = function (toUser, userId) {

    console.log(toUser.Email);
    console.log(userId);

    return new Promise ((res, rej) => {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            maxConnections: 1,
            rateLimit: 1,
            auth: {
                user: process.env.GOOGLE_USER,
                pass: process.env.GOOGLE_PASS
            }
        });

        const message = {
            from: process.env.GOOGLE_USER,
            to: toUser.Email,
            subject: 'Evo Bank - Activate Account',
            html: `
                <h3>Hello, ${toUser.Username}</h3>
                <p> Thank you for registering into our platform. If you didn't perform this action, please ignore this email. </p>
                <p> To activate your account please follow this link: <a target="_" href="${process.env.DOMAIN}/api/v1/activate/${userId}">Activation link</a></p>
                <p> Best regards, </p>
                <p> Evo Bank Team </p>
            `
        }

        transporter.sendMail(message, function (err, info) {
            if (err) {
                rej(err);
            } else {
                res(info);
            }
        });
    });
}