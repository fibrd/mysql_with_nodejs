const { User } = require('../models')
const jwt = require('jsonwebtoken')
const config = require('../config/config')
const { response } = require('express')

const ONE_HOUR = 60 * 60

function jwtSignUser(user) {
	return jwt.sign(user, config.authentication.jwtSecret, {
		expiresIn: ONE_HOUR,
	})
}

module.exports = {
	async register(req, res) {
		try {
			const user = await User.create(req.body)
			const userJson = user.toJSON()
			res.status(201).send({
				message: 'Klient byl zaregistrován.',
			})
		} catch (err) {
			console.log(err)
			res.status(400).send({ error: 'Při registraci došlo k chybě.' })
		}
	},

	async login(req, res) {
		try {
			const { username, password } = req.body
			const user = await User.findOne({
				where: {
					username,
				},
			})

			if (!user) {
				return res.status(403).send({ error: 'Špatné přihlašovací údaje' })
			}

			const isPasswordValid = await user.comparePassword(
				password,
				user.password
			)
			if (!isPasswordValid) {
				return res.status(403).send({ error: 'Špatné přihlašovací údaje' })
			}

			const userJson = user.toJSON()
			delete userJson.password
			res.cookie('token', jwtSignUser(userJson), {
				maxAge: 3600000,
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
			res.status(500).send({ error: 'Nastala neznámá chyba.' })
		}
	},

	async logout(req, res) {
		res.clearCookie('token')
		res.status(200).send({ message: 'Klient byl odhlášen' })
	},
}
