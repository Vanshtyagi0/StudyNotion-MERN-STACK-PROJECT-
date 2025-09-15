const {Mongoose, default: mongoose} = require("mongoose");
const Category = require('../models/Category');
const { get } = require("../routes/User");

function getRandomInt(max){
    return Math.floor(Math.random() * max);
}

exports.createCategory = async (req, res) =>{
    try{
        const {name, description} = req.body;

        if(!name || !description){
            return res.status(400).json({
                success: false,
                messsage: "All fields are required"
            });
        }

        const categoryDetails = await Category.create({
            name: name,
            descriptiion: description,
        });
        console.log("CategoryDetails:",categoryDetails);

        return res.status(200).json({
            success: true,
            message: "category created successfully"
        });
    }
    catch(err){
        console.log("Error in create Category:",err);
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}


exports.showAllCategories = async (req, res) =>{
    try{
        const allCategory =  await Category.find({});
        return res.status(200).json({
            success: true,
            data: allCategory,
        });
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

exports.categoryPageDetails = async (req, res) => {
    try {
        const { CategoryId } = req.body;
        //console.log("CategoryId from server:", CategoryId);

        // Validate CategoryId
        if (!CategoryId || !mongoose.Types.ObjectId.isValid(CategoryId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid or missing CategoryId",
            });
        }

        // Fetch selected category with published courses
        const selectedCategory = await Category.findById(CategoryId)
            .populate({
                path: "courses",
                match: { status: "Published" },
                populate: { path: "ratingAndReview" },
                populate: { path: "instructor"}
            })
            .exec();

        if (!selectedCategory) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        // Handle no courses case
        if (selectedCategory.courses.length === 0) {
            console.log("No courses found for the selected category");
            return res.status(200).json({
                success: true,
                message: "No courses found for the selected category",
                flag: "NoCourseFound",
                data: {
                selectedCategory,
            },
            });
        }

        // Fetch other categories
        const otherCategories = await Category.find({ _id: { $ne: CategoryId } })
            .populate({
                path: "courses",
                populate: { path: "instructor"},
                match: { status: "Published" },
            })
            .exec();

        // Select a random different category
        let differentCategory = null;
        if (otherCategories.length > 0) {
            const randomIndex = Math.floor(Math.random() * otherCategories.length);
            differentCategory = otherCategories[randomIndex];
        }

        // Fetch top 10 most-sold courses using aggregation
        const mostSellingCourses = await Category.aggregate([
            { $unwind: "$courses" },
            { $match: { "courses.status": "Published" } },
            {
                $lookup: {
                    from: "courses",
                    localField: "courses",
                    foreignField: "_id",
                    as: "courseDetails",
                },
            },
            { $unwind: "$courseDetails" },
            {
                $lookup: {
                    from: "users",
                    localField: "courseDetails.instructor",
                    foreignField: "_id",
                    as: "courseDetails.instructor",
                },
            },
            { $sort: { "courseDetails.sold": -1 } },
            { $limit: 10 },
            { $replaceRoot: { newRoot: "$courseDetails" } },
        ]);

        return res.status(200).json({
            success: true,
            data: {
                selectedCategory,
                differentCategory,
                mostSellingCourses,
            },
        });
    } catch (err) {
        console.error("Error in categoryPageDetails:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message,
        });
    }
};