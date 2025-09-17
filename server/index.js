const express = require("express");
const app = express();

const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payment");
const courseRoutes = require("./routes/Course");
const contactRoutes = require("./routes/Contact");

const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const {cloudinaryConnect} = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
require("dotenv").config();
const PORT = process.env.PORT || 4000;

// Database connect
database.dbConnect();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true
    }) 
);

app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp",
    })
);

//CloudinaryConnection
cloudinaryConnect();

//Routes
app.use("/api/v1/auth",userRoutes);
app.use("/api/v1/profile",profileRoutes);
app.use("/api/v1/course",courseRoutes);
app.use("/api/v1/payment",paymentRoutes);
app.use("/api/v1",contactRoutes);

// default routes
app.get("/", (req, res) =>{
    return res.json({
        success: true,
        message: "Your server is up and running...",
    });
});

app.listen(PORT, () =>{
    console.log(`App is running at http://localhost:${PORT}`);
});


