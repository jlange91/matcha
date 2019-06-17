const mailer = require("nodemailer")

module.exports = {
    email: (email, subject, message) => {
        return new Promise((resolve) => {

        mailer.createTestAccount(() => {
            let transporter = mailer.createTransport({
                host: "smtp.mailtrap.io",
                port: 2525,
                auth: {
                  user: process.env.MAIL_USER,
                  pass: process.env.MAIL_PASSWORD
                }
            })
            const mail = {
                from: "noreply@matcha.com",
                to: email,
                subject: subject,
                html: message
            }
            transporter.sendMail(mail, (error) => {
                transporter.close()
                if (error)
                    resolve(false)
                resolve(true)
            })
        })
    })
    }
}