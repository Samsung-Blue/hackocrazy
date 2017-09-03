"use strict"
module.exports=function(sequelize,DataTypes){
	var users = sequelize.define("users",{
		aadhaarid: {
			type: DataTypes.INTEGER,
			unique: true,
			allowNull: false,
			primaryKey: true
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		age: {
			type: DataTypes.INTEGER,
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
		allowvote: {
			type: DataTypes.STRING,
			allowNull: false,
			default: "n"
		},
		voted: {
			type: DataTypes.STRING,
			allowNull: false,
			default: "n"
		}
	},{
    freezeTableName: true
  });
	return users;
};