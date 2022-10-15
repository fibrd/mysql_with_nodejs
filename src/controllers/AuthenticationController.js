const { User } = require('../models')
const jwt = require('jsonwebtoken')
const config = require('../config/config')
const { response } = require('express')

const ONE_HOUR = 60 * 60
const ONE_DAY = 24 * ONE_HOUR
const ONE_WEEK = 7 * ONE_DAY
const ONE_MONTH = 30 * ONE_WEEK

function jwtSignUser(user) {
	return jwt.sign(user, config.authentication.jwtSecret, {
		expiresIn: ONE_HOUR,
	})
}

module.exports = {
	async register(req, res) {
		try {
			const { email, username, password } = req.body
			await User.create({ email, username, password })
			res.status(201).send({
				message: 'Klient byl zaregistrován.',
			})
		} catch (err) {
			console.log(err)
			res.status(400).send({
				message: 'Při registraci došlo k chybě.',
				errors: err.errors?.map(({ message }) => message),
			})
		}
	},

	async login(req, res) {
		try {
			const user = await User.findOne({
				where: {
					email: req.body.email,
				},
			})

			if (!user) {
				return res.status(403).send({ message: 'Špatné přihlašovací údaje' })
			}

			const isPasswordValid = await user.comparePassword(
				req.body.password,
				user.password
			)
			if (!isPasswordValid) {
				return res.status(403).send({ message: 'Špatné přihlašovací údaje' })
			}

			const { email, username, role } = user.toJSON()
			const userJson = { email, username, role }
			res.cookie('token', jwtSignUser(userJson), {
				maxAge: ONE_MONTH,
				httpOnly: false,
				secure: false,
			})
			res.send({
				id: response.id,
				user: userJson,
				token: jwtSignUser(userJson),
			})
		} catch (err) {
			console.log(err)
			res.status(500).send({ message: 'Nastala neznámá chyba.' })
		}
	},

	async logout(req, res) {
		res.clearCookie('token')
		res.status(200).send({ message: 'Klient byl odhlášen' })
	},
}
