const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");
const {uploadImageToCloudinary} = require("../utils/imageUploader");
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const CourseProgress = require("../models/CourseProgress");
const {convertSecondsToDuration} = require("../utils/secToDuration");
const { default: mongoose } = require("mongoose");

exports.createCourse = async (req, res) =>{
    try{

      // get USer id from request Object
      const userId = req.user.id;

      // Get all required fields from request body
      let {
        courseName, 
        courseDescription, 
        whatYouWillLearn, 
        price,
        tag: _tag, 
        category,
        status,
        instructions: _instructions,
      } = req.body;

      console.log("course data for creation:",req.body);
      // Get thumbnail image from request files
      const thumbmail = req.files.thumbnailImage;

      // Convert the tags and instructions from stringify array to array
      const tag = JSON.parse(_tag);
      const instructions = JSON.parse(_instructions);

      console.log("tag:",tag);
      console.log("Instructions:",instructions);
      console.log(courseDescription,":",courseName,":",whatYouWillLearn,":",price,":",thumbmail,":",category)

      // Check if any of the required fields are missing
      if(!courseDescription ||
        !courseName ||
        !whatYouWillLearn ||
        !price ||
        !tag.length ||
        !thumbmail ||
        !category ||
        !instructions.length
        ) {
          return res.status(400).json({
              success: false,
              message: "All field are Mandatary"
          });
      }

      if(!status || status === undefined){
        status = "Draft"
      }

      // Check if the user is an instructor
      const instructorDetails = await User.findById(userId, {
        accountType: "Instructor"
      });

      

      if(!instructorDetails){
          return res.status(404).json({
              success: false,
              message: "Instructor details not found"
          });
      }

      // Check if the category given is valid
      const categoryDetails = await Category.findById(category);
      if(!categoryDetails){
          return res.status(404).json({
              success: false,
              message: "Category details not found"
          });
      }

      const thumbmailImage = await uploadImageToCloudinary(
        thumbmail,
        process.env.FOLDER_NAME
      );

      // Create a new course with the given details 
      const newCourse = await Course.create({
          courseName,
          courseDescription,
          price,
          instructor: instructorDetails._id,
          category: categoryDetails._id,
          tag,
          whatUWillLearn: whatYouWillLearn,
          thumbnail: thumbmailImage.secure_url,
          status: status,
          instructions,
      });
      console.log("Newcourse:",newCourse);

      // Add the new course to the User schema of the instructor
      await User.findByIdAndUpdate(
          {
            _id: instructorDetails._id
          },
          {
              $push:{
                  courses: newCourse._id
              }
          },
          {new:true}
      );

      //Add the new course to the category
      const categoryDetails2 = await Category.findByIdAndUpdate(
          {
            _id: category
          },
          {
              $push:{
                  courses:newCourse._id
              }
          },
          {new:true}
      );
      console.log("HEREEEEEE",categoryDetails2);

      // Return the new course suceessfully
      return res.status(200).json({
          success: true,
          message: "Course created successfully",
          data: newCourse
      });
  }
  catch(err){
      console.error(err);
      return res.status(500).json({
          success: false,
          message: "Failed to creating course",
          error: err.message
      });
    }
}

exports.editCourse = async (req, res) => {
  try {
    const { courseId, ...updates } = req.body;

    console.log("Updates while edit:",updates)

    // Whitelist allowed fields to update
    const allowedUpdates = [
      "courseName",
      "courseDescription",
      "price",
      "tag",
      "instructions",
      "category",
      "status",
      "whatYouWillLearn"
    ];
    const updateKeys = Object.keys(updates).filter((key) =>
      allowedUpdates.includes(key)
    );
    console.log("updatekeys:",updateKeys);


    const course = await Course.findById(courseId)
    if (!course) {
      return res.status(404).json({ error: "Course not found" })
    }

    const oldCategory = course.category;
    // If Thumbnail Image is found, update it
    if (req.files) {
      console.log("thumbnail update")
      const thumbnail = req.files.thumbnailImage
      const thumbnailImage = await uploadImageToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME
      )
      course.thumbnail = thumbnailImage.secure_url
    }

    // Update only the fields that are present in the request body
    // for (const key in updates) {
    //   if (updates.hasOwnProperty(key)) {
    //     if (key === "tag" || key === "instructions") {
    //       course[key] = JSON.parse(updates[key])
    //     } else {
    //       course[key] = updates[key]
    //     }
    //   }
    // }
    for (const key of updateKeys) {
      try {
        if (["tag", "instructions"].includes(key)) {
          course[key] = JSON.parse(updates[key]);
        } else {
          if (key === "whatYouWillLearn"){
            course["whatUWillLearn"] = updates[key];
            } else{
              course[key] = updates[key];
            }            
        }
      } catch (parseError) {
        return res.status(400).json({
          error: `Invalid format for ${key}`,
          details: parseError.message,
        });
      }
    }

    await course.save()

    if(updateKeys.includes("category") && !oldCategory.equals(updates.category)){
      await Category.findByIdAndUpdate(
          {
            _id: updates.category
          },
          {
              $addToSet : { courses: course._id } // Prevent duplicates
          },
          {new:true}
      );

      await Category.findByIdAndUpdate(
        {_id : oldCategory },
        {
          $pull : {
            courses : course._id
          }
        }
      )

    }

    const updatedCourse = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReview")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec()

    res.json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

exports.getAllCourses = async (req, res) =>{
    try{
      const allCourse =  await Course.find(
        {status: "Published"},
          {   
            courseName: true,
            price: true,
            thumbnail: true,
            instructor: true,
            ratingAndReview: true,
            studentEnrolled: true
          }
      )
      .populate("instructor").exec();
                                                                      
      return res.status(200).json({
          success: true,
          message: "Data for all courses feched successfully",
          data: allCourse,
      });
    }
    catch(err){
        console.log(err);
        return res.status(404).json({
            success: false,
            message: "Can't Fetch course Data",
            Error: err.message
        });
    }
}


exports.getCourseDetails = async (req, res) =>{
    try{
        const courseId = req.body.courseId;

        const courseDetails = await Course.findOne({_id: courseId})
        .populate({
            path:"instructor",
            populate:{
                path:"additionalDetails"
            }
        })
        .populate("category")
        .populate("ratingAndReview")
        .populate({
            path: "courseContent",
            populate:{
                path: "subSection",
                select: "-videoUrl"
            }
        })
        .exec();


        if(!courseDetails){
            return res.status(404).json({
                success: false,
                message: `Could not find the course with id:${courseId}`
            });
        }

        // if (courseDetails.status === "Draft") {
        //   return res.status(403).json({
        //     success: false,
        //     message: `Accessing a draft course is forbidden`,
        //   });
        // }

        let totalDurationInSeconds = 0
        courseDetails.courseContent?.forEach((content) => {
          content.subSection?.forEach((subSection) => {
            const timeDurationInSeconds = parseInt(subSection.timeDuration)
            totalDurationInSeconds += timeDurationInSeconds
          });
        });

        const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

        return res.status(200).json({
            success: true,
            message: "courseDetail fetched successfully",
            data: {
              courseDetails,
              totalDuration
            }
        });
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

exports.getFullCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body
    const userId = req.user.id

    console.log("userId:",userId,"\ncouseId:",courseId);

    const courseDetails = await Course.findOne({ _id: courseId })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReview")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec()

    
    let courseProgressCount = await CourseProgress.findOne({
      courseId: courseId,
      userId: userId,
    });

    console.log("courseProgressCount : ", courseProgressCount)

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      })
    }

    // if (courseDetails.status === "Draft") {
    //   return res.status(403).json({
    //     success: false,
    //     message: `Accessing a draft course is forbidden`,
    //   });
    // }

    let totalDurationInSeconds = 0
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration)
        totalDurationInSeconds += timeDurationInSeconds
      })
    });

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds)
  


    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
        completedVideos: courseProgressCount?.completedVideos
          ? courseProgressCount?.completedVideos
          : [],
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      Error: error.message,
      message: "Internal server error"
    })
  }
}

// Get a list of Course for a given Instructor
exports.getInstructorCourses = async (req, res) => {
  try {
    // Get the instructor ID from the authenticated user or request body
    const instructorId = req.user.id

    // Find all courses belonging to the instructor
    const instructorCourses = await Course.find({
      instructor: instructorId,
    }).sort({ createdAt: -1 })

    // Return the instructor's courses
    res.status(200).json({
      success: true,
      data: instructorCourses,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Failed to retrieve instructor courses",
      error: error.message,
    })
  }
}
// Delete the Course
exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.body

    // Find the course
    const course = await Course.findById(courseId)
    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    // Unenroll students from the course
    const studentsEnrolled = course.studentEnrolled
    for (const studentId of studentsEnrolled) {
      await User.findByIdAndUpdate(studentId, {
        $pull: { courses: courseId },
      })
    }

    // Delete sections and sub-sections
    const courseSections = course.courseContent
    for (const sectionId of courseSections) {
      // Delete sub-sections of the section
      const section = await Section.findById(sectionId)
      if (section) {
        const subSections = section.subSection
        for (const subSectionId of subSections) {
          await SubSection.findByIdAndDelete(subSectionId)
        }
      }

      // Delete the section
      await Section.findByIdAndDelete(sectionId)
    }

    // Delete the course
    await Course.findByIdAndDelete(courseId)

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

