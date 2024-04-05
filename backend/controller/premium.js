const Razorpay = require('razorpay')

let Order = require('../model/order')
let userController = require('./user')
require('dotenv').config()




exports.purchasePremium =async (req,res,next)=>{
    try{    
        var rzp = new Razorpay({
            key_id : process.env.RZP_KEY_ID,
            key_secret : process.env.RZP_KEY_SECRET
        })

        const amount = 2500;
        rzp.orders.create({amount , currency:'INR'}, (err, order)=>{
            if(err){
                throw new Error(JSON.Stringify(err))
            }
            req.user.createOrder( {orderId: order.id , status:'PENDING'}).then(()=>{
                return res.status(201).json({order ,key_id: rzp.key_id })
            })
            .catch(err=>{
                throw new Error(err)
            })
        })
    }
    catch(err){
        res.status(403).json({message:'somthing went wrong', error:err})
    }
}


exports.UpdateTransactionStatus = async (req,res) =>{
    const {payment_id , order_id } = req.body;
    userId = req.user.id
    console.log(payment_id)
    
        try{
            
            const order = await Order.findOne({where : {orderId : order_id}})

    
           if(order){
            console.log('payment id=>' , payment_id)
            if(payment_id){
                const promise1= await  order.update({payment : payment_id , status :'SUCCESSFULL'})
                const promise2= await req.user.update({ispremiumuser : true})
        
                    Promise.all([promise1,promise2]).then(()=>{
                        res.status(202).json({success : true, message : 'transaction succssesfull' ,token : userController.generateAccesToken(userId,undefined,true)})
                    }) 
            }
            else{
                await order.update({ status: 'FAILED' });
                await req.user.update({ ispremiumuser: false });
                res.status(200).json({success:false , message : 'transaction failed'})
            }
           }
           else{
                res.status(400).json({message :'invalid order'})
           }   
        }
        catch(err){
            console.log(err)
            res.status(500).json({ success: false, message: 'Internal server error' })
        }  
}

   