"use strict"
module.exports=function(sequelize,DataTypes){
	var users = sequelize.define("users",{
		aadhaarid: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false,
			primaryKey: true
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		dob: {
			type: DataTypes.STRING,
			allowNull: false
		},
		address: {
			type: DataTypes.TEXT
		},
		email: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false
		},
		fppath: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false
		},
		voted: {
			type: DataTypes.STRING,
			allowNull: false,
			default: "n"
		},
		key: {
			type: DataTypes.STRING,
			allowNull: false
		}
	},{
    freezeTableName: true
  });
	return users;
};