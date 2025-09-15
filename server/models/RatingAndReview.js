const mongoose = require('mongoose');

const ratingAndReviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating must not exceed 5'],
      validate: {
        validator: Number.isInteger,
        message: 'Rating must be an integer',
      },
    },
    review: {
      type: String,
      trim: true, // Remove leading/trailing whitespace
      default: '', // Allow empty reviews
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt
  }
);

// Add a compound unique index to prevent duplicate reviews by the same user for the same course
//ratingAndReviewSchema.index({ user: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('RatingAndReview', ratingAndReviewSchema);