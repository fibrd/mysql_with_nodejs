const Promise = require('bluebird')
const bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'))

function hashPassword(user, options) {
	const SALT_FACTOR = 8

	if (!user.changed('password')) {
		return
	}

	return bcrypt
		.genSaltAsync(SALT_FACTOR)
		.then(salt => bcrypt.hashAsync(user.password, salt, null))
		.then(hash => {
			user.setDataValue('password', hash)
		})
}

module.exports = (sequelize, DataTypes) => {
	const User = sequelize.define(
		'User',
		{
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: {
					args: true,
					msg: 'Uživatel se zadaným Emailem je už zaregistrovaný.',
				},
				validate: {
					notEmpty: {
						args: true,
						msg: 'Email je povinná položka.',
					},
					isEmail: {
						args: true,
						msg: 'Email musí být v odpovídajícím tvaru.',
					},
				},
			},
			username: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notEmpty: {
						args: true,
						msg: 'Uživatelské jméno je povinná položka.',
					},
					len: {
						args: [3, 10],
						msg: 'Uživatelské jméno musí být minimálně 3 a maximálně 10 znaků dlouhé.',
					},
				},
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notEmpty: {
						args: true,
						msg: 'Heslo je povinná položka.',
					},
					len: {
						args: [6, 1000],
						msg: 'Heslo není dostatečně dlouhé.',
					},
				},
			},
			coupon: {
				type: DataTypes.STRING,
			},
			role: {
				type: DataTypes.STRING,
				defaultValue: 'user',
			},
		},
		{
			hooks: {
				beforeUpdate: hashPassword,
				beforeSave: hashPassword,
			},
		}
	)

	User.prototype.comparePassword = function (password, savedPassword) {
		return bcrypt.compareAsync(password, savedPassword)
	}

	return User
}
