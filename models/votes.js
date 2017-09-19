"use strict"
module.exports=function(sequelize,DataTypes){
	var votes = sequelize.define("votes",{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			allowNull: false,
			unique: true,
			primaryKey: true
		},
		party: {
			type: DataTypes.STRING,
			allowNull: false
		}
	},{
    freezeTableName: true
  });
	return votes;
};