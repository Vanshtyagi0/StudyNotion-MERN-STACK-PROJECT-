const User = require('../models/User');
const mailSender = require('../utils/mailSender');
const bcrypt = require('bcrypt');
const crypto = require("crypto");
require("dotenv").config();


//reset password token
exports.resetPasswordToken = async (req, res) =>{
    /*
    1. get email from req body
    2. check user for this email, email verification
    3. generate token
    4. update User by adding token and expiration time
    5. create url
    6. send mail containing the url
    7.return response
    */
    try{
        const email = req.body.email;

        const user = await User.findOne({email: email});

        if(!user){
            return res.status(401).json({
                success: false,
                message: `This Email: ${email} is not Registered With Us Enter a Valid Email `
            });
        }

        const token = crypto.randomBytes(20).toString("hex");

        const updatedDetails = await User.findOneAndUpdate(
            {email: email},
            {
                token: token,
                resetPasswordExpires: Date.now() + 5*60*1000,
            },
            { new: true });

        const url = process.env.FRONTEND_URL + `/update-password/${token}`

       await mailSender(email,
                        "Password Reset link",
                        `Your Link for email verification is ${url}. Please click this url to reset your password.`);
        
        return res.status(200).json({
            success: true,
            message: "Email Sent Successfully, Please Check Your Email to Continue Further"
        });
    }
    catch(err){
        console.log("Error in reseting password",err);
        return res.status(500).json({
            error: err.message,
			success: false,
			message: `Some Error in Sending the Reset Message`,
        });
    }
}

//resetPassword
exports.resetPassword = async (req, res) =>{
    /*
    1. data fetch
    2. validation
    3. get user details from db using token
    4. if no entry - invalid tokken
    5. token time check
    6. hash password
    7. password update
    8. return response 
    */
    try{
        const {password, confirmPassword, token} = req.body;

        if(password !== confirmPassword){
            return res.status(401).json({
                success: false,
                message: "Password and Confirm Password Does not Match"
            });
        }

        const userDetails = await User.findOne({token: token});

        if(!userDetails){
            return res.status(403).json({
                success: false,
                message: "Token is invalid",
            });
        }
        if(userDetails.resetPasswordExpires < Date.now()){
            return res.status(403).json({
                success: false,
                message: "Token is expired, Please regenerate new token"
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.findOneAndUpdate(
            {token: token},
            {password: hashedPassword},
            {new: true}
        );

        return res.status(200).json({
            success: true,
            message: "Password reset successfully"
        });
    }
    catch(err){
        console.log("Error in reset password:",err);
        return res.status(500).json({
            error: err.message,
			success: false,
			message: `Some Error in Updating the Password`
        });
    }
}