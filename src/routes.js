const CourseController = require('./controllers/CoursesController')
const AuthenticationController = require('./controllers/AuthenticationController')
const AuthorizationController = require('./controllers/AuthorizationController')

module.exports = app => {
	// AUTHENTICATION
	app.post('/api/register', AuthenticationController.register)
	app.post('/api/login', AuthenticationController.login)
	app.get('/api/logout', AuthenticationController.logout)

	// Courses
	app.get('/api/courses', CourseController.index)
	app.post(
		'/api/courses',
		AuthorizationController.validateLogin,
		CourseController.post
	)
	app.put(
		'/api/courses',
		AuthorizationController.validateLogin,
		CourseController.put
	)
	app.delete(
		'/api/courses',
		AuthorizationController.validateLogin,
		CourseController.delete
	)
}
