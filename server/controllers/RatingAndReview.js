const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/Course");
const { default: mongoose } = require("mongoose");

exports.createRating = async (req, res) => {
    try {
        // 1. Get user ID
        const userId = req.user.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized: User not authenticated',
            });
        }

        // 2. Fetch and validate data from request body
        const { rating, review, courseId } = req.body;

        if (!rating || !courseId) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: rating and courseId are required',
            });
        }

        // Validate rating (e.g., must be a number between 1 and 5)
        if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be an integer between 1 and 5',
            });
        }

        // Validate courseId
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid course ID',
            });
        }

        // 3. Check if user is enrolled
        const courseDetail = await Course.findOne({
            _id: courseId,
            studentEnrolled: { $elemMatch: { $eq: userId } },
        });

        if (!courseDetail) {
            return res.status(404).json({
                success: false,
                message: 'Student is not enrolled in the course',
            });
        }

        // 4. Check if user already reviewed the course
        const alreadyReviewed = await RatingAndReview.findOne({
            user: userId,
            course: courseId,
        });

        if (alreadyReviewed) {
            return res.status(403).json({
                success: false,
                message: 'Course is already reviewed by the user',
            });
        }

        // 5. Start a transaction for atomicity
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // 6. Create rating and review
            const ratingReview = await RatingAndReview.create({
                user: userId,
                course: courseId,
                rating: rating,
                review: review || "",
            });

            console.log("Rating and review:",ratingReview);

            // 7. Update course with the rating/review
            await Course.findByIdAndUpdate(
                courseId,
                {
                    $push: { ratingAndReview: ratingReview._id },
                },
                { new: true, session }
            );

            // Commit the transaction
            await session.commitTransaction();
            session.endSession();

            // 8. Return success response
            return res.status(200).json({
                success: true,
                message: 'Rating and review created successfully',
                data: ratingReview,
            });
        } catch (err) {
            // Abort transaction on error
            await session.abortTransaction();
            session.endSession();
            throw err;
        }
    } catch (err) {
        console.error('Error creating rating:', err.message);
        return res.status(500).json({
            success: false,
            message: 'Failed to create rating and review',
            error: err.message 
        });
    }
};

exports.getAverageRating = async (req, res) =>{
    try{
        const courseId = req.body.courseId;

        const result = await RatingAndRevview.aggregate([
            {
                $match: {
                    course: new mongoose.Types.ObjectId(courseId),
                }
            },
            {
                $group: {
                    _id: null,
                    averageRating: {$avg: "$rating"},
                }
            }
        ]);

        if(result.length > 0){
            return res.status(200).json({
                success: true,
                averageRating: result[0].averageRating,
            });
        }
        return res.status(200).json({
            success: true,
            message: "Average rating is 0 , no rating given till now",
            averageRating: 0
        });
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
                success: false,
                message: err.message,
            });
    }
}

exports.getAllRating = async (req, res) =>{
    try{
        const allReviews = await RatingAndReview.find({})
        .sort({rating: "desc"})
        .populate({
            path:"user",
            select: "firstName lastName email image"
        })
        .populate({
            path: "course",
            select: "courseName",
        })
        .exec();

        return res.status(200).json({
            success: true,
            message: "all review fetch successfully",
            data: allReviews
        });
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}