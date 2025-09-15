const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const Profile = require("../models/Profile");
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/mailSender");
const {passwordUpdated} = require("../mail/templates/passwordUpdated");
require("dotenv").config();



//send otp
exports.sendotp = async (req, res) =>{

    try{
        //fetch email from req body
        const {email} = req.body;

        //check if user already exist
        const checkUserPresent = await User.findOne({email});

        //if user already exit , then return a response
        if(checkUserPresent) {
            return res.status(401).json({
                success: false,
                message: "User already registered",
            });
        }

        //generate otp
        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        });

        //check unique otp or not
        let result = await OTP.findOne({otp: otp});

        while(result){ //bad practise
            otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
            });

            result = await OTP.findOne({otp: otp});
        }

        const otpPayload = {email, otp};

        // create and entry in db
        const otpBody = await OTP.create(otpPayload);
        console.log("otpBody:",otpBody);

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully",
        });
    }
    catch(err){
        console.log("error ocurr in sendOTp:",err);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

//signUp
exports.signup = async (req, res) =>{

    /*
    1. Data fetch from req body
    2. validation check
    3. password metch with confirm password
    4. check user already exits or not

    5. find most recent otp stored for the user
    6. validate otp
    7. hash password
    8. entry create in db
    9. return res
    */
    try{
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp
        } = req.body;

        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
            return res.status(403).json({
                success: false,
                message: "all field are required"
            })
        }

        if(password !== confirmPassword){
            return res.status(400).json({
                success: false,
                message: "password and confirmPassword value does not metch, please try again"
            });
        }

        const existUser = await User.findOne({email});
        if(existUser){
            return res.status(400).json({
                success: false,
                message: "User already registered",
            });
        }

        const recentOtp = await OTP.find({email}).sort({createdAt: -1}).limit(1);
        //console.log("recentotp:",recentOtp);

        if(recentOtp.length === 0){
            //otp not find
            return res.status(400).json({
                success: false,
                message: "OTP not found"
            })
        } else if(otp !== recentOtp[0].otp){
            return res.status(400).json({
                success: false,
                message: "invalid otp"
            });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: contactNumber || null
        });

        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password: hashPassword,
            accountType,
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}_${lastName}`
        })
        return res.status(200).json({
            success: true,
            message: "User is registered successfully",
            user
        });
    }
    catch(err){
        console.log("error in signup:", err);
        return res.status(500).json({
            success: false,
            message: "User cannot be registered , please tryv again",
        });
    }
}

//login
exports.login  = async (req, res) =>{
    /*
    1. get data from req body
    2. validation chech
    3. user check exist or not
    4. generate jwt token after password matching
    5. create cookie and send response
    */
    try{
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(403).json({
                success: false,
                message: "All field are required, please try again"
            });
        }

        const user = await User.findOne({email}).populate("additionalDetails");

        if(!user){
            return res.status(401).json({
                success: false,
                message: "User is not registered, Please signup first"
            });
        }

        if(await bcrypt.compare(password, user.password)){
            const payload = {
                email: user.email,
                id: user._id,
                accountType: user.accountType
            }
            
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "24h",
            });
            
            user.token = token;
            user.password = undefined;

            const option = {
                expires: new Date(Date.now() + 24*60*60*1000),
                httpOnly: true
            }
            return res.cookie("token", token, option).status(200).json({
                success: true,
                token,
                user,
                message: "Logged in successfully"
            })
        } else{
            return res.status(401).json({
                success: false,
                message: "Password is incorrect"
            });
        }
    }
    catch(err){
        console.log("error in login:",err);
        return res.status(500).json({
            success: false,
            message: "Login failure, Please try again"
        });
    }
}

//change password
exports.changePassword = async (req, res) => {
  try {
    const userDetails = await User.findById(req.user.id);
    if (!userDetails) {
      return res.status(404).json({ success: false, message: "User not found!" });
    }

    const { oldPassword, newPassword } = req.body;

    // Validate old password
    const isPasswordMatch = await bcrypt.compare(oldPassword, userDetails.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ success: false, message: "The old password is incorrect" });
    }


    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters long" });
    }

    // Prevent reuse of same password
    const isSamePassword = await bcrypt.compare(newPassword, userDetails.password);
    if (isSamePassword) {
      return res.status(400).json({ success: false, message: "New password cannot be the same as old password" });
    }

    // Update password
    const encryptedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUserDetails = await User.findByIdAndUpdate(
      req.user.id,
      { password: encryptedPassword },
      { new: true }
    );

    // Send notification email (non-critical)
    try {
      await mailSender(
        updatedUserDetails.email,
        "Password for your account has been updated",
        passwordUpdated(
          updatedUserDetails.email,
          `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
        )
      );
    } catch (error) {
      console.error("Error occurred while sending email:", error);
    }

    return res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Error occurred while updating password:", error);
    return res.status(500).json({ success: false, message: "Error occurred while updating password", error: error.message });
  }
};