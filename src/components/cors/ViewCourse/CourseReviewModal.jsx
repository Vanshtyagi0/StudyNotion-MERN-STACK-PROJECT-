import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { RxCross2 } from "react-icons/rx"
import { useSelector } from "react-redux"

import { createRating } from "../../../services/operations/courseDetailsAPI"
import IconBtn from "../../common/IconBtn"
import StarRating from "../../common/StarRating"


export default function CourseReviewModal({ setReviewModal }) {
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
  const { courseEntireData } = useSelector((state) => state.viewCourse)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      review: "", // Consistent with API and schema
      courseRating: 0,
    },
  })

  // Watch rating for validation
  const courseRating = watch("courseRating")

  useEffect(() => {
    // Reset form on mount
    reset({
      review: "",
      courseRating: 0,
    })
    setError("")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Reset form and clear error when modal closes
  const handleClose = () => {
    reset()
    setError("")
    setReviewModal(false)
  }

  const ratingChanged = (newRating) => {
    setValue("courseRating", newRating)
    if (error && newRating > 0) {
      setError("") // Clear rating error when rating is set
    }
  }

  const onSubmit = async (data) => {
    console.log("DATA of review:",data);
    if (data.courseRating === 0) {
      setError("Please select a rating (at least 1 star)")
      return
    }

    setLoading(true)
    setError("")

    try {
      await createRating(
        {
          courseId: courseEntireData._id,
          rating: data.courseRating,
          review: data.review.trim(), // Trim whitespace
        },
        token
      )
      //toast.success("Review submitted successfully!")
      handleClose()
    } catch (err) {
      console.error("Error submitting review:", err)
      setError(err.message || "Failed to submit review. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[1000] !mt-0 grid h-screen w-screen place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm"
      >
      <div className="my-10 w-11/12 max-w-[700px] rounded-lg border border-richblack-400 bg-richblack-800">
        {/* Modal Header */}
        <div className="flex items-center justify-between rounded-t-lg bg-richblack-700 p-5">
          <h2 id="review-modal-title" className="text-xl font-semibold text-richblack-5">
            Add Review
          </h2>
          <button
            onClick={handleClose}
            className="focus:outline-none focus:ring-2 focus:ring-richblack-5 rounded"
          >
            <RxCross2 className="text-2xl text-richblack-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <div className="flex items-center justify-center gap-x-4">
            <img
              src={user?.image} 
              alt={user?.firstName}
              className="aspect-square w-[50px] rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-richblack-5">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-sm text-richblack-5">Posting Publicly</p>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-pink-100 border border-pink-300 text-pink-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col items-center">
            {/* Star Rating */}
            <div className="mb-4">
              <label htmlFor="courseRating" className="block text-sm font-medium text-richblack-5 mb-2">
                Rate this course <sup className="text-pink-200">*</sup>
              </label>
              <StarRating
                id="courseRating"
                count={5}
                value={courseRating}
                onChange={ratingChanged}
                size={24}
              />
              {errors.courseRating && (
                <span className="ml-2 text-xs tracking-wide text-pink-200 block mt-1">
                  {errors.courseRating.message}
                </span>
              )}
            </div>

            {/* Review Textarea */}
            <div className="flex w-11/12 flex-col space-y-2">
              <label htmlFor="review" className="text-sm text-richblack-5">
                Add Your Experience
              </label>
              <textarea
                id="review"
                placeholder="Add Your Experience (Optional)"
                {...register("review", {
                  required: false, // Align with schema (optional)
                  maxLength: {
                    value: 1000,
                    message: "Review must be less than 1000 characters",
                  },
                  validate: (value) => {
                    if (value && value.trim().length === 0) {
                      return "Review cannot be empty spaces"
                    }
                    return true
                  },
                })}
                className="form-style resize-none min-h-[130px] w-full" // Fixed 'resize-x-none' to 'resize-none'
                disabled={loading}
                rows={6}
              />
              {errors.review && (
                <span className="ml-2 text-xs tracking-wide text-pink-200">
                  {errors.review.message}
                </span>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="mt-6 flex w-11/12 justify-end gap-x-2">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className={`flex cursor-pointer items-center gap-x-2 rounded-md py-[8px] px-[20px] font-semibold transition-colors ${
                  loading
                    ? "bg-richblack-500 text-richblack-200 cursor-not-allowed"
                    : "bg-richblack-300 text-richblack-900 hover:bg-richblack-400"
                }`}
              >
                Cancel
              </button>
              <IconBtn
                text={loading ? "Submitting..." : "Save"}
               disabled={loading}
                type="submit"
                customClasses={loading ? "opacity-50 cursor-not-allowed" : ""}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}