require('dotenv').config()
const express = require('express')
const config = require('./src/config/config')
const cookieParser = require('cookie-parser')
const mysql = require('mysql')

const app = express()
app.use(
	express.json({
		type: ['application/json', 'text/plain'],
	})
)
app.use(cookieParser())

require('./src/routes')(app)

const connection = mysql.createConnection({
	host: config.db.options.host,
	user: config.db.user,
	password: config.db.password,
	database: config.db.database,
})

connection.connect(err => {
	if (err) {
		console.log('Error connection to MySQL database: ', err)
		return
	}
	console.log('MySQL successfully connected!')
})

app.listen(config.app_port, () =>
	console.log(`server running on PORT ${config.app_port}`)
)
