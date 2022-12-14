const nodemailer = require('nodemailer')

module.exports = async (email, subject, text) => {
	try {
		const transporter = nodemailer.createTransport({
			host: process.env.EMAIL_HOST,
			port: process.env.EMAIL_PORT,
			secure: true,
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASSWORD,
			},
		})

		await transporter.sendMail({
			from: process.env.EMAIL_USER,
			to: email,
			subject: subject,
			text: text,
		})

		console.log('email send successfully')
	} catch (err) {
		console.log(err, 'email not sent')
	}
}
