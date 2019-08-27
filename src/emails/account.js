const sgMail = require('@sendgrid/mail')
// const sendGridAPIKey = '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'

sgMail.setApiKey(process.env.SENDGRID_API_KEY)
// sgMail.setApiKey(sendGridAPIKey)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: '17ucs035@lnmiit.ac.in',
        subject: 'Thanks for joining in',
        text: `Welcome ${name}`
    })
}

const sendCancelEmail = (email, name) =>{
    sgMail.send({
        to: email,
        from: '17ucs035@lnmiit.ac.in',
        subject: 'Thanks for joining in',
        text: `Goodbye!! ${name}`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
}