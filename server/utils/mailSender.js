const nodemailer = require("nodemailer");
require("dotenv").config();

const mailSender = async (email , title, body) =>{
    try{
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT || 587, // Default to 587 for non-SSL
            secure: false, // Use secure connection for SSL
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });

        let info = await transporter.sendMail({
            from: `"StudyNotion || codeHelp" <${process.env.MAIL_USER}>`, // Correct "from" field
            to: email,
            subject: title,
            html: body, // Make sure body is sanitized (to prevent XSS)
        });
        console.log("Email sent:",info);
        return info;
        
    }
    catch(err){
        console.error("Error sending email:", err.message);
        throw new Error("Failed to send email: " + err.message);
    }
}

module.exports = mailSender;