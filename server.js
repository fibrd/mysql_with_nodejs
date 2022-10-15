require('dotenv').config()
const express = require('express')
const config = require('./src/config/config')
const cookieParser = require('cookie-parser')
const { sequelize } = require('./src/models')
const app = express()

app.use(
	express.json({
		type: ['application/json', 'text/plain'],
	})
)
app.use(cookieParser())

require('./src/routes')(app)

sequelize.sync().then(() => {
	app.listen(config.app_port)
	console.log(`Server is running at port ${config.app_port}`)
})
