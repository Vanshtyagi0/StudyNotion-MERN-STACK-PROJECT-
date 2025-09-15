const mongoose = require("mongoose");
require("dotenv").config();

exports.dbConnect = () =>{
    mongoose.connect(process.env.MONGODB_URL)
    .then( () => console.log("db connected successfully"))
    .catch( (err) =>{
        console.log("db connection failed");
        console.error(err);
        process.exit(1);
    });
}