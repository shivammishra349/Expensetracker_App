const sequelize = require('../database/connection');
const User = require('../model/user');
const Expense = require('../model/expense');

exports.getFeatures = async (req, res, next) => {
    try {
        let users = await User.findAll({
            
            order:[['Total_cost','DESC']]
        });
       
        res.status(200).json(users);
        
    } catch (err) {
        console.log('error',err)
        res.status(500).json({ message: 'Internal server error' });
    }   
};