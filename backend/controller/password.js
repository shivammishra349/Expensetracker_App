const Sib = require('sib-api-v3-sdk');
const uuid= require('uuid')
let User = require('../model/user');
let Password = require('../model/password')
let bcrypt = require('bcrypt')
require('dotenv').config();


const forgetPassword = async (req,res,next)=>{
    try{
        let email = req.body.email

        let user = await User.findOne({ where: { email: email } });
        

    if(user){
        let id = uuid.v4()
        await Password.create({id , isactive : true, userId:user.id})
            .catch(err=>{
                throw new Error(err)
            })

            const defaultClient = Sib.ApiClient.instance;
            defaultClient.basePath =  'https://api.sendinblue.com/v3';

            const apiKey = defaultClient.authentications['api-key'];
            console.log(process.env.API_KEY)
            apiKey.apiKey = process.env.API_KEY

            const transApi = new Sib.TransactionalEmailsApi();

            const sender = {
                email: process.env.EMAIL
            };

            const receivers = [
                {
                    email: email
                }
            ];

            transApi.sendTransacEmail({
                sender,
                to: receivers,
                subject: 'Reset password',
                htmlContent:`<h2>to change the password click on this link</h2><a href='http://192.168.239.14:4444/password/resetpassword/${id}'><h2>Reset password<h2></a>`,

            })
            .then(response => {
                console.log('Email sent successfully:', response);
            })
            .catch(error => {
                console.error('Error sending email:', error);
            });

        }
        else{
            res.status(404).json({message: 'Sorry you are not a user'})
            console.log
        }

   }
   catch(err){
        return res.json({message:err, success:false})
   }
      

}

// const resetPassword = (req,res,next)=>{
//     res.send('hello')
// }


const resetPassword = (req, res) => {
    const id = req.params.id;
    Password.findOne({ where: { id } }).then(forgotpasswordrequest => {
        if (forgotpasswordrequest) {
            forgotpasswordrequest.update({ isactive: false });
            // Return the HTML content with the appropriate ID
            res.status(200).send(`
                <html>
                <script>
                function formsubmitted(e){
                    e.preventDefault();
                    console.log('called')
                }
            </script>

            <form action="/password/updatepassword/${id}" method="get">
                <label for="password">Enter New password</label>
                <input name="password" type="password" required></input>
                <button>reset password</button>
            </form>

                </html>
            `);
        } else {
            res.status(404).send('Password reset request not found');
        }
    }).catch(error => {
        console.error('Error while finding password reset request:', error);
        res.status(500).send('Internal server error');
    });
}
 let updatePassword = (req,res)=>{
    let {password} = req.query;
    console.log(password)
    let {resetpasswordid} = req.params;
    Password.findOne({where:{id: resetpasswordid}})
        .then((passwordrequest)=>{
            User.findOne({where:{ id : passwordrequest.userId}})
                .then((user)=>{
                    if(user){
                        let saltRounds = 10
                        bcrypt.genSalt(saltRounds,(err,salt)=>{
                            if(err){
                                console.log(err);
                                throw new Error(err)
                            }
                            bcrypt.hash(password , salt , function(err,hash){
                                if(err){    
                                    console.log(err);
                                    throw new Error(err)
                                }
                                user.update({password:hash})
                                    .then(()=>{
                                        res.status(200).json({message: 'password updated successfully'})
                                    })
                            })
                        })
                    }
                    else{
                        return res.status(404).json({messaage:'no user Exist', success:false})
                    }
                })
        })

    }

module.exports = {
    forgetPassword,
    resetPassword,
    updatePassword
}