let Sequelize=require('sequelize');

let sequelize = require('../database/connection')


let Table = sequelize.define('expense',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    amount:{
        type:Sequelize.INTEGER,
    },
    
    description:{
        type:Sequelize.STRING,
        //  allowNull:false
    },
    catagory:{
        type:Sequelize.STRING,
        allowNull:false
    }
})

module.exports = Table