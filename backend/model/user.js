const Sequelize=require('sequelize');

const sequelize=require('../database/connection')

const table=sequelize.define('users',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
    name:{
        type:Sequelize.STRING,
    },
    email:{
        type:Sequelize.STRING,
        allowNull:false,
        unique:true
    },
    Total_cost:{
        type:Sequelize.INTEGER,
        defaultValue:0,
    },
    password:{
        type:Sequelize.STRING,
        allowNull:false 
    },
   ispremiumuser : Sequelize.BOOLEAN
   
})

module.exports=table