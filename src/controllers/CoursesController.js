const sequelize = require('sequelize')
const { Course } = require('../models')

module.exports = {
	async index(req, res) {
		try {
			const courses = await Course.findAll({})
			res.status(200).send({ message: courses })
		} catch (err) {
			console.log(err)
			res.status(500).send({ error: 'Nastala neznámá chyba.' })
		}
	},

	async post(req, res) {
		try {
			const { name, description, duration } = req.body
			const newCourse = await Course.create({ name, description, duration })
			res.status(201).send({ message: newCourse })
		} catch (err) {
			console.log(err)
			res.status(500).send({ error: 'Nastala neznámá chyba.' })
		}
	},

	async put(req, res) {
		try {
			const { id, name, description, duration } = req.body
			const [, updatedCount] = await Course.update(
				{ name, description, duration },
				{ returning: true, where: { id } }
			)
			if (!updatedCount) {
				return res
					.status(404)
					.send({ error: 'Kurz se zadaným ID nebyl nalezen.' })
			}
			res.status(200).send({ message: 'Kurz byl aktualizován.' })
		} catch (err) {
			console.log(err)
			res.status(500).send({ error: 'Nastala neznámá chyba.' })
		}
	},

	async delete(req, res) {
		try {
			const deletedCourse = await Course.destroy({
				where: {
					id: req.body.id,
				},
			})
			if (!deletedCourse) {
				return res
					.status(404)
					.send({ error: 'Kurz se zadaným ID nebyl nalezen.' })
			}
			res.status(200).send({ message: 'Kurz byl vymazán.' })
		} catch (err) {
			console.log(err)
			res.status(500).send({ error: 'Nastala neznámá chyba.' })
		}
	},
}
