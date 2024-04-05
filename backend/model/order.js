let Sequelize = require('sequelize')

let sequelize = require('../database/connection')

let order = sequelize.define('order',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    payment:Sequelize.STRING,
    orderId:Sequelize.STRING,
    status:Sequelize.STRING,
})

module.exports = order