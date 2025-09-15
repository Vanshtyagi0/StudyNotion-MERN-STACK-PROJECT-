const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const {uploadImageToCloudinary} = require("../utils/imageUploader");
require("dotenv").config();

exports.createSubSection = async (req, res) =>{
    /*
    1. data fetch from req.body and extract file/video
    2. data validation
    3. upload video to cloudinary
    4. create a subSection
    5. update section with this subsection id
    6. return res
    */
    try{

        const {sectionId, title, description} = req.body;

        const video = req.files.video;

        if(!sectionId || !title || !description || !video){
            return res.status(400).json({
                success: false,
                message: "All field are required"
            });
        }
        // upload the video file to cloudinary
        const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);

        const subSectionDetails = await SubSection.create({
            title: title,
            timeDuration: `${uploadDetails.duration}`,
            description: description,
            videoUrl: uploadDetails.secure_url
        });

        // update the correspondind section with thenewly created sub-section
         const updatedSection = await Section.findByIdAndUpdate(
                                                    {_id: sectionId},
                                                    {
                                                        $push:{
                                                            subSection: subSectionDetails._id,
                                                        }
                                                    },
                                                    {new: true})
                                                    .populate("subSection")
                                                    .exec();

        return res.status(200).json({
            success: true,
            message: "Subsection created successfuly",
            data: updatedSection
        });
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: "Internal server Error",
            error: err.message
        });
    }
}


exports.updateSubSection = async (req, res) =>{
    try{
        const {subSectionId, title, description, sectionId} = req.body;
        const subSection = await SubSection.findById(subSectionId);

        if(!subSection){
            return res.status(404).json({
                success: false,
                message: "SubSection not found"
            });
        }

        if(title !== undefined){
            subSection.title = title;
        }
        if(description !== undefined){
            subSection.description = description;
        }
        if(req.files && req.files.video !== undefined) {
            const video = req.files.video;
            const uploadDetails = await uploadImageToCloudinary(
                video,
                process.env.FOLDER_NAME
            );
            subSection.videoUrl = uploadDetails.secure_url;
            subSection.timeDuration = `${uploadDetails.duration}`;
        }

        await subSection.save();

        // find updated section and return it
        const updatedSection = await Section.findById(sectionId)
        .populate("subSection").exec();
      

        return res.status(200).json({
            success: true,
            message: "Subsection created successfuly",
            data: updatedSection
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


exports.deleteSubSection = async (req, res) =>{
    try{
        const { subSectionId, sectionId } = req.body
        await Section.findByIdAndUpdate(
        { _id: sectionId },
        {
            $pull: {
            subSection: subSectionId,
            },
        }
        )
        const subSection = await SubSection.findByIdAndDelete({ _id: subSectionId })

        if (!subSection) {
        return res
            .status(404)
            .json({ success: false, message: "SubSection not found" })
        }

        // find updated section and return it
        const updatedSection = await Section.findById(sectionId).populate(
        "subSection"
        )

        return res.json({
        success: true,
        message: "SubSection deleted successfully",
        data: updatedSection,
        })
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: "Unable to delete a section, Please try again",
            error: err.message
        });
    }
}