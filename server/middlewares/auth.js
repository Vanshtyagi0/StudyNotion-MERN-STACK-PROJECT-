const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require("../models/User");

//auth
exports.auth = async (req, res, next) =>{
    try{
        console.log("token feching:");

        console.log("tokenC:",req.cookies?.token)
        console.log("tokenB:",req.body?.token)
        console.log("tokenH:",req.header)

        const token = req.cookies?.token
                    || req.body?.token 
                    || req.header("Authorization")?.replace("Bearer ", "");

        //if token missing then return res

        if(!token){
            return res.status(401).json({
                success: false,
                message: "token is missing"
            });
        }

        //verify the token
        try{
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log("decode;",decode);
            req.user = decode;
        }
        catch(err){
            console.log("Error in verify tokeen:",err);
            return res.status(401).json({
                success: false,
                message: "Token is invalid"
            });
        }
        next();
    }
    catch(err){
        console.log("Error in auth middleware:",err);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while validating the token",
        });
    }
}

//isStudent
exports.isStudent = async (req, res, next) =>{
    try{
        if(req.user.accountType !== "Student"){
            return res.status(401).json({
                success: false,
                message: "This is a protected route for student only"
            });
        }
        next();
    }
    catch(err){
        console.log("Error in isStudent middleware:",err);
        return res.status(500).json({
            success: false,
            message: "user role can not be verify",
        });
    }
}

//isInstructor
exports.isInstructor = async (req, res, next) =>{
    try{
        if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                success: false,
                message: "This is a protected route for Instructor only"
            });
        }
        next();
    }
    catch(err){
        console.log("Error in Instructor middleware:",err);
        return res.status(500).json({
            success: false,
            message: "user role can not be verify, Please try again",
        });
    }
}

//isAdmin
exports.isAdmin = async (req, res, next) =>{
    try{
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success: false,
                message: "This is a protected route for admin only"
            });
        }
        next();
    }
    catch(err){
        console.log("Error in admin middleware:",err);
        return res.status(500).json({
            success: false,
            message: "user role can not be verify, Please try again",
        });
    }
}