const sendEmail = require('./sendEmail');

const sendVerificationEmail = async ({
    name,
    email,
    verificationToken,
    password,
    origin,
}) => {
    const verifyEmail = `${origin}/verify-email?token=${verificationToken}&email=${email}`;

    const message = `<p>Please confirm your email by clicking on the following link:
    <a href="${verifyEmail}">Verify Email</a> </p>
    <p>This is your login password ${password}. please reset password on first login`;

    return sendEmail({
        to:email,
        subject:'Email confirmation',
        html:`<h4> Hello, ${name}</h4>
        ${message}`,
    });
};

module.exports = sendVerificationEmail;
