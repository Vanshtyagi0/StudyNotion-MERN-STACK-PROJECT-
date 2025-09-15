const Profile = require("../models/Profile");
const User = require("../models/User");
const Course =require("../models/Course");
const CourseProgress = require("../models/CourseProgress");

const {convertSecondsToDuration} = require("../utils/secToDuration");
const {uploadImageToCloudinary} = require("../utils/imageUploader");

exports.updateProfile = async (req, res) =>{
    try{
        const {
          firstName = "",
          lastName = "",
          dateOfBirth = "",
          about = "",
          contactNumber = "",
          gender = "",
        } = req.body;
        const userId = req.user.id;


        const userDetails  = await User.findById(userId);
        const profileId  = userDetails.additionalDetails;

        if(firstName && lastName){
          const user = await User.findByIdAndUpdate(userId, {
            firstName,
            lastName,
          })
          await user.save();
        }

        const profileDetails = await  Profile.findById(profileId);
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.about = about;
        profileDetails.contactNumber = contactNumber;
        profileDetails.gender = gender;

        await profileDetails.save();

        const updatedUserDetails = await User.findById(userId)
        .populate("additionalDetails")
        .exec();

        return res.status(200).json({
            success: true,
            message: "Profile Updated succeesfully",
            updatedUserDetails,
        });
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: "Something went wrong while updating profile",
            Error: err.message
        });
    }
}


//Explore: how can we schedule a job/req  
exports.deleteAccount = async (req, res) =>{
    try{
        const id = req.user.id;

        const userDetails = await User.findById({_id: id});

        if(!userDetails){
            return res.status(404).json({
                success: false,
                message: "user not found"
            });
        }

        await Profile.findByIdAndDelete({_id: userDetails.additionalDetails});

        for (const courseId of userDetails.courses) {
          await Course.findByIdAndUpdate(
            courseId,
            {
              $pull:{ studentEnrolled: id}
            },
            {new: true}
          );
        }

        // Now delete user
        await User.findByIdAndDelete({_id:id});
        // await CourseProgress.deleteMany({userId: id});

        return res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });
    }
    catch(err){
      console.log(err);
        return res.status(500).json({
            success: false,
            message: "User cannot be deleted successfully",
            Error: err.message
        });
    }
}

exports.getAllUserDetails = async (req, res) =>{
    try{
        const userId = req.user.id;

        const userData = await User.findById(userId).populate("additionalDetails").exec();

        return res.status(200).json({
            success: true,
            message: "user data fetched successfully",
            userData
        });
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: "Something went wrong while getting user details",
            Error: err.message
        });
    }
}

exports.updateDisplayPicture = async (req, res) => {
  try {
    const displayPicture = req.files.displayPicture;

    if (!displayPicture) {
      return res.status(400).json({
        success: false,
        message: "No display picture file uploaded.",
      });
    }

    const userId = req.user.id
    const image = await uploadImageToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000
    )
    console.log("image details:",image);
    
    console.log("userId:",userId);
    const updatedProfile = await User.findByIdAndUpdate(
      { _id: userId },
      { image: image.secure_url },
      { new: true }
    )
    if(!updatedProfile){
      return res.status(404).json({
        success: false,
        message: "Profile not find for update"
      });
    }

    res.send({
      success: true,
      message: `Image Updated successfully`,
      data: updatedProfile,
    })
  }
  catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id
    let userDetails = await User.findOne({
      _id: userId,
    })
      .populate({
        path: "courses",
        populate: {
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        },
      })
      .exec()

    userDetails = userDetails.toObject()
    var SubsectionLength = 0
    for (var i = 0; i < userDetails.courses.length; i++) {
      let totalDurationInSeconds = 0
      SubsectionLength = 0
      for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
        totalDurationInSeconds += userDetails.courses[i].courseContent[
          j
        ].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
        userDetails.courses[i].totalDuration = convertSecondsToDuration(
          totalDurationInSeconds
        )
        SubsectionLength +=
          userDetails.courses[i].courseContent[j].subSection.length
      }
      let courseProgressCount = await CourseProgress.findOne({
        courseId: userDetails.courses[i]._id,
        userId: userId,
      })
      courseProgressCount = courseProgressCount?.completedVideos.length
      if (SubsectionLength === 0) {
        userDetails.courses[i].progressPercentage = 100
      } else {
        // To make it up to 2 decimal point
        const multiplier = Math.pow(10, 2)
        userDetails.courses[i].progressPercentage =
          Math.round(
            (courseProgressCount / SubsectionLength) * 100 * multiplier
          ) / multiplier
      }
    }

    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find user with id: ${userDetails}`,
      })
    }
    return res.status(200).json({
      success: true,
      data: userDetails.courses,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

exports.instructorDashboard = async (req, res) => {
  try {
    const courseDetails = await Course.find({ instructor: req.user.id })

    if(!courseDetails){
      return res.status(404).json({
        success: false,
        message: "Courses Not found for this Instructor"
      })
    }

    const courseData = courseDetails.map((course) => {
      const totalStudentsEnrolled = course.studentEnrolled.length
      const totalAmountGenerated = totalStudentsEnrolled * course.price

      // Create a new object with the additional fields
      const courseDataWithStats = {
        _id: course._id,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        // Include other course properties as needed
        totalStudentsEnrolled,
        totalAmountGenerated,
      }

      return courseDataWithStats
    })

    res.status(200).json({
      success: true,
      message: "fetch instructor data successfully",
      courses: courseData 
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      Error: error.message
    })
  }
}