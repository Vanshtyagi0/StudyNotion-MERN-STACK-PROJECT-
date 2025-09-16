const mongoose = require('mongoose');


const contactInfo = new mongoose.Schema({ 
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    phoneNo: {
        type: Number,
        required: true,
        trim: true
    },
    countryCode:{
        type: String
    },
},
{
    timestamps: true, // Automatically add createdAt and updatedAt
}
);

// Add a compound unique index to prevent duplicate reviews by the same user for the same course
//ratingAndReviewSchema.index({ user: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('ContactInfo', contactInfo);