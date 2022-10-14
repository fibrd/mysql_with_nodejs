module.exports = {
	app_port: process.env.APP_PORT,
	db: {
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DATABASE,
		options: {
			host: process.env.DB_HOST,
			dialect: process.env.DB_DIALECT,
		},
	},
	authentication: {
		jwtSecret: process.env.JWT_SECRET,
	},
}
