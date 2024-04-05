let Sequelize = require('sequelize');

let sequelize = require('../database/connection');

let URLTable = sequelize.define('url',{
    url:Sequelize.STRING
})

module.exports = URLTable;
