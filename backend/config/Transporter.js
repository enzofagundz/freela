const nodemailer = require('nodemailer')

class Transporter {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'sandbox.smtp.mailtrap.io',
            port: 587,
            auth: {
                user: process.env.USER_EMAIL,
                pass: process.env.USER_PASSWORD,
            }
        })
    }

    sendMail(mailOptions) {
        return new Promise((resolve, reject) => {
            this.transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(info)
                }
            })
        })
    }
}

module.exports = new Transporter();