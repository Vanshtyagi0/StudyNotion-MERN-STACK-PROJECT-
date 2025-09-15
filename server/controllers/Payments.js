const {instance} = require("../config/razorpay");
const mongoose = require("mongoose");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const crypto = require("crypto"); 

const {courseEnrollmentEmail, paymentSuccessfullyEmail} = require("../mail/templates/courseEnrollmentEmail");


exports.capturePayment = async(req, res) =>{

    const {courses} = req.body;
    const userId = req.user.userId

    if(courses?.length === 0){
        return res.json({
            success: false,
            message: "Please provide Course Id"
        });
    }

    let totalAmount = 0;

    for(const course_id of courses){
        let course;
        try{
            course = await Course.findById(course_id);
            if(!course){
                return res.status(200).json({
                    success: false,
                    message: "could not find course"
                })
            }
            const uid = new mongoose.Types.ObjectId(userId);

            if(course.studentEnrolled.includes(uid)){
                return res.status(200).json({
                    success: false,
                    message: "Student is already enrolled"
                })
            }
            totalAmount += course.price;
        }
        catch(err){
            console.log(err);
            return res.status(500).json({
                success: false,
                message: "Error in finding total amount",
                Error: err.message
            })
        }
    }

    const option = {
        amount: totalAmount * 100,
        currency: "INR",
        receipt: Math.random(Date.now()).toString(),
    }

    try{
        const paymentResponse = await instance.orders.create(option);
        return res.json({
            success: true,
            message: paymentResponse,
        })
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: "Could not initiate Order."
        });
    }
}

// varify signature of Razorpay and server
exports.verifyPayment = async (req, res) =>{
    const razorpay_order_id = req.body?.razorpay_order_id;
    const razorpay_payment_id = req.body?.razorpay_payment_id;
    const razorpay_signature = req.body?.razorpay_signature;

    const courses = req.body?.Courses;
    const userId  = req.user.id;

    if(!razorpay_order_id || !razorpay_payment_id || razorpay_signature ||
        !courses || userId ){
            return res.status(200).json({
                success: false,
                message: "Payment Failed"
            });
    }

    let body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex");

    if(expectedSignature === razorpay_signature){
        //enrolled karwao student ko

        await enrollStudent(courses, userId, res);


        return res.status(200).json({
            success: true,
            message: "payment verified"
        });
    }
    return res.status(200).json({
        success: "false",
        message: "Payment failed."
    })
}

const enrollStudent = async (courses, userId, res) =>{
    
    for(const courseId of courses){
        try{
            const enrolledCourse = await Course.findOneAndUpdate(
            {_id: courseId},
            {$push: {studentEnrolled: userId}},
            {new: true},
            )

            if(!enrolledCourse){
                return res.status(500).json({
                    success: false,
                    message: "could not found"
                });
            }

            const courseProgress = await courseProgress.create({
                courseId: courseId,
                userId: userId,
                completedVideos: [],
            })

            //find the student and add the course to their list of enrolledcourses
            const enrolledStudent = await User.findByIdAndUpdate( userId,
                {$push: {
                    courses: courseId,
                    courseProgress: courseProgress._id
                }},
                {new: true}
            )

            const emailResponse = await mailSender(
                enrollStudent.email,
                `Successfully Enrolled into ${enrolledCourse.courseName}`,
                courseEnrollmentEmail(enrolledCourse.cours, `${enrolledStudent.firstName}`)
            )
            console.log("Email sent successfully",emailResponse);
            }
            catch(err){
                console.log(err);
                return res.status(500).json({
                    success: false,
                    Error: err.message,
                    message: "Error in addind student in any course"
                });
            }
    }
    
}

exports.sendPaymentSuccessEmail = async (req, res) =>{
    const {orderId, paymentId, amount} = req.body;

    const userId = req.user.id;

    if(!orderId || !paymentId || !amount || userId){
        return res.status(400).json({
            success: false,
            message: "Please provide all the field"
        })
    }

    try{
        const enrolledStudent = await User.findById(userId);
        await mailSender(
            enrolledStudent.email,
            "payment received",
            paymentSuccessfullyEmail(
                `${enrolledStudent.firstName}`,
                amount/100, orderId, paymentId)
        )
    }
    catch(err){
        console.log("Error in sending email:",err);
        return res.status(500).json({
            success: false,
            message: "could not send email"
        });
    }
}



// capture the payments and initiate the Razorpay order
// exports.capturePayment = async (req, res) =>{
//     /*
//     1. get courseId and userId
//     2. validation
//     3. valid couseId and valid couseDetails
//     4. user already pay for the same course
//     5. order create
//     6. return res
//     */
//     try{
//         const {course_id} = req.body;
//         const userId = req.user.id;

//         if(!course_id){
//             return res.json({
//                 success: false,
//                 message: "Please provide valid course ID"
//             });
//         }

//         let course = await Course.findById(course_id);

//         if(!course){
//             return res.status(404).json({
//                 success: false,
//                 message: "could not find course"
//             });
//         }

//         const uid = new mongoose.Types.ObjectId(userId);

//         if(course.studentEnrolled.includes(uid)){
//             return res.status(200).json({
//                 success: false,
//                 message: "Student is already enroled"
//             });
//         }

//         const amount = course.price;
//         const currency  = "INR";

//         const options = {
//             amount: amount * 100,
//             currency,
//             receipt: Math.random(Date.now()).toString(),
//             notes: {
//                 courseId: course_id,
//                 userId
//             }
//         }
//         try{
//             const paymentResponse = await instance.order.create(options);
//             console.log(paymentResponse);
//             return res.status(200).json({
//                 success: true,
//                 courseName: course.courseName,
//                 courseDescription: course.courseDescription,
//                 thumbnail: course.thumbnail,
//                 orderId: paymentResponse.id,
//                 amount: paymentResponse.amount,
//                 currency: paymentResponse.currency,
//             });
//         }
//         catch(err){
//             console.log(err);
//             return res.status(500).json({
//                 success: false,
//                 message: "Could not initiate order"
//             });
//         }
//     }
//     catch(err){
//         console.error(err);
//         return res.status(500).json({
//                 success: false,
//                 message: err.message
//             });
//     }
// }

// // varify signature of Razorpay and server
// exports.verifuSignature = async (req, res) =>{
    
//     const webhookSecret = "12svgvk";
//     const signature = req.headers["x-razorpay-signature"];

//     const shasum = crypto.createHmac("sha256", webhookSecret);
//     shasum.update(JSON.stringify(req.body));
//     const digest = shasum.digest("hex");

//     if(signature === digest){
//         console.log("payment is Authorised");

//         const {courseId, userId} = req.body.payload.payment.entity.notes;

//         try{
//             // find the course and enroll the student in it
//             const enrolledcourse = await Course.findByIdAndUpdate(
//                                             {_id: courseId},
//                                             {$push: {studentEnrolled: userId}},
//                                             {new: true}
//             );

//             if(!enrolledcourse){
//                 return res.status(500).json({
//                     success: false,
//                     message: "Course not found"
//                 });
//             }

//             // find the student and add the course in their list enrolled course 
//             const enrolledStudent = await User.findByIdAndUpdate(
//                                             {_id: courseId},
//                                             {$push: {courses: courseId}},
//                                             {new: true}
//             );
//             console.log(enrolledStudent);
            
//             if(!enrolledStudent){
//                 return res.status(500).json({
//                     success: false,
//                     message: "Sudent not found"
//                 });
//             }

//             // mail send confirmation ka krna hai
//             const response  = await mailSender(
//                                             enrolledStudent.email,
//                                             "congratulation",
//                                             "you are onboad into new codehalp course",
//             );
//             console.log(response);

//             return res.status(200).json({
//                 success: true,
//                 message: "Signature verified successfully"
//             });
//         }
//         catch{
//             return res.status(500).json({
//                 success: false,
//                 message: err.message
//             });
//         }
//     }
//     else{
//         return res.status(400).json({
//             success: false,
//             message: "Invalid request"
//         });
//     }
// }
