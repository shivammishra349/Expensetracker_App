let Sequelize = require('sequelize')

const sequelize = require('../database/connection');

let Table = sequelize.define('forgetPassword' , {
    id:{
        type:Sequelize.UUID,
        allowNull:false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey:true
    },
    isactive:{
        type:Sequelize.BOOLEAN
    }
})
module.exports=Table