module.exports = (sequelize, DataTypes) => {
	const Course = sequelize.define('Course', {
		name: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false,
		},
		description: DataTypes.STRING,
		duration: DataTypes.INTEGER,
	})

	return Course
}
