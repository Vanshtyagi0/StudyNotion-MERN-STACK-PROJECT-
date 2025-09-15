const Section = require("../models/Section");
const Course = require("../models/Course");
const SubSection = require("../models/SubSection");

exports.createSection = async (req, res) =>{
    /*
    1. data fetch
    2. data validation
    3. create Section
    4. update course with section object id
    5. return
    */
    try{
        const {sectionName, courseId} = req.body;

        if(!sectionName || !courseId){
            return res.status(400).json({
                success: false,
                message: "Missing required property"
            });
        }

        const newSection = await Section.create({
            sectionName
        });
        const updateCourseDetail = await Course.findByIdAndUpdate(
                                            courseId,
                                            {
                                                $push:{
                                                    courseContent: newSection._id,
                                                }
                                            },
                                            {new: true})
                                            .populate(
                                                {
                                                    path: "courseContent",
                                                    populate: {
                                                        path: "subSection"
                                                    }
                                                }
                                            )
                                            .exec();
        return res.status(200).json({
            success: true,
            message: "Section created successfully",
            updateCourseDetail
        });
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: "Unable to create a section",
            error: err.message
        });
    }
}

exports.updateSection = async (req, res) =>{
    /*
      data input
      data validation
      update data
      return res
    */
    try{
        const {sectionName, sectionId, courseId} = req.body;

        if(!sectionName || !sectionId || !courseId){
            return res.status(400).json({
                success: false,
                message: "missing properties"
            });
        }

        const section = await Section.findByIdAndUpdate(sectionId, {sectionName}, {new: true});

        const course = await Course.findById(courseId)
        .populate({
            path: "courseContent",
            populate:{
                path: "subSection"
            }
        })
        .exec();

        return res.status(200).json({
            success: true,
            message: "section updated successfully",
            data: course
        });


    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: "Unable to update a section, Please try again",
            error: err.message
        });
    }
}


exports.deleteSection = async (req, res) =>{
    /*
      get id -> assuming that we are sending in params
      use find by id and delete
      return res
    */
    try{
        const {sectionId, courseId} = req.body;

        await Course.findByIdAndUpdate(courseId,{
            $pull:{
                courseContent: sectionId,
            }
        })

        const section = await Section.findById(sectionId);

        if(!section){
            return res.status(404).json({
                success: false,
                message: "Section not found"
            });
        }

        // delete subSections
        await SubSection.deleteMany({_id:{$in: section.subSection}});

        await Section.findByIdAndDelete(sectionId); 

        const course = await Course.findById(courseId)
        .populate({
            path: "courseContent",
            populate:{
                path: "subSection"
            }
        })
        .exec();

        
        return res.status(200).json({
            success: true,
            message: "section deleted successfully",
            data: course
        });


    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message
        });
    }
}