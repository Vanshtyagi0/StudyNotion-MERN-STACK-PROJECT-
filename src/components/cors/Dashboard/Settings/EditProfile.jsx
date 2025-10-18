import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { updateProfile } from "../../../../services/operations/SettingsAPI"
import IconBtn from "../../../common/IconBtn"

const genders = ["Male", "Female", "Non-Binary", "Prefer not to say", "Other"]

export default function EditProfile() {
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const submitProfileForm = async (data) => {
    try {
      dispatch(updateProfile(token, data))
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message)
    }
  }

  return (
    <form onSubmit={handleSubmit(submitProfileForm)} className="space-y-6">
      {/* Profile Information Card */}
      <div className="rounded-2xl border-2 border-richblack-700 bg-richblack-800 overflow-hidden transition-all hover:border-richblack-600 hover:shadow-lg">
        {/* Header */}
        <div className="px-6 md:px-8 py-4 bg-richblack-900/50 border-b border-richblack-700">
          <h2 className="text-lg md:text-xl font-bold text-richblack-5">
            Profile Information
          </h2>
          <p className="text-xs md:text-sm text-richblack-400 mt-1">
            Update your personal details
          </p>
        </div>

        {/* Form Content */}
        <div className="p-6 md:p-8 space-y-6">
          {/* Name Fields Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* First Name */}
            <div className="space-y-2">
              <label 
                htmlFor="firstName" 
                className="text-sm font-medium text-richblack-300 flex items-center gap-1"
              >
                First Name
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                placeholder="Enter first name"
                className="w-full px-4 py-3 rounded-xl bg-richblack-700 border-2 border-richblack-600 text-richblack-5 placeholder-richblack-400 focus:outline-none focus:border-yellow-50 focus:ring-2 focus:ring-yellow-50/20 transition-all"
                {...register("firstName", { required: true })}
                defaultValue={user?.firstName}
              />
              {errors.firstName && (
                <span className="text-xs text-red-400 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Please enter your first name
                </span>
              )}
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <label 
                htmlFor="lastName" 
                className="text-sm font-medium text-richblack-300 flex items-center gap-1"
              >
                Last Name
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                placeholder="Enter last name"
                className="w-full px-4 py-3 rounded-xl bg-richblack-700 border-2 border-richblack-600 text-richblack-5 placeholder-richblack-400 focus:outline-none focus:border-yellow-50 focus:ring-2 focus:ring-yellow-50/20 transition-all"
                {...register("lastName", { required: true })}
                defaultValue={user?.lastName}
              />
              {errors.lastName && (
                <span className="text-xs text-red-400 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Please enter your last name
                </span>
              )}
            </div>
          </div>

          {/* DOB and Gender Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Date of Birth */}
            <div className="space-y-2">
              <label 
                htmlFor="dateOfBirth" 
                className="text-sm font-medium text-richblack-300 flex items-center gap-1"
              >
                Date of Birth
                <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="dateOfBirth"
                id="dateOfBirth"
                className="w-full px-4 py-3 rounded-xl bg-richblack-700 border-2 border-richblack-600 text-richblack-5 focus:outline-none focus:border-yellow-50 focus:ring-2 focus:ring-yellow-50/20 transition-all"
                {...register("dateOfBirth", {
                  required: {
                    value: true,
                    message: "Please enter your Date of Birth.",
                  },
                  max: {
                    value: new Date().toISOString().split("T")[0],
                    message: "Date of Birth cannot be in the future.",
                  },
                })}
                defaultValue={user?.additionalDetails?.dateOfBirth}
              />
              {errors.dateOfBirth && (
                <span className="text-xs text-red-400 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.dateOfBirth.message}
                </span>
              )}
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <label 
                htmlFor="gender" 
                className="text-sm font-medium text-richblack-300 flex items-center gap-1"
              >
                Gender
                <span className="text-red-500">*</span>
              </label>
              <select
                name="gender"
                id="gender"
                className="w-full px-4 py-3 rounded-xl bg-richblack-700 border-2 border-richblack-600 text-richblack-5 focus:outline-none focus:border-yellow-50 focus:ring-2 focus:ring-yellow-50/20 transition-all cursor-pointer"
                {...register("gender", { required: true })}
                defaultValue={user?.additionalDetails?.gender}
              >
                {genders.map((ele, i) => {
                  return (
                    <option key={i} value={ele} className="bg-richblack-700">
                      {ele}
                    </option>
                  )
                })}
              </select>
              {errors.gender && (
                <span className="text-xs text-red-400 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Please select your gender
                </span>
              )}
            </div>
          </div>

          {/* Contact and About Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Contact Number */}
            <div className="space-y-2">
              <label 
                htmlFor="contactNumber" 
                className="text-sm font-medium text-richblack-300 flex items-center gap-1"
              >
                Contact Number
                <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="contactNumber"
                id="contactNumber"
                placeholder="Enter contact number"
                className="w-full px-4 py-3 rounded-xl bg-richblack-700 border-2 border-richblack-600 text-richblack-5 placeholder-richblack-400 focus:outline-none focus:border-yellow-50 focus:ring-2 focus:ring-yellow-50/20 transition-all"
                {...register("contactNumber", {
                  required: {
                    value: true,
                    message: "Please enter your Contact Number.",
                  },
                  maxLength: { value: 12, message: "Invalid Contact Number" },
                  minLength: { value: 10, message: "Invalid Contact Number" },
                })}
                defaultValue={user?.additionalDetails?.contactNumber}
              />
              {errors.contactNumber && (
                <span className="text-xs text-red-400 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.contactNumber.message}
                </span>
              )}
            </div>

            {/* About */}
            <div className="space-y-2">
              <label 
                htmlFor="about" 
                className="text-sm font-medium text-richblack-300"
              >
                About
              </label>
              <input
                type="text"
                name="about"
                id="about"
                placeholder="Enter bio details"
                className="w-full px-4 py-3 rounded-xl bg-richblack-700 border-2 border-richblack-600 text-richblack-5 placeholder-richblack-400 focus:outline-none focus:border-yellow-50 focus:ring-2 focus:ring-yellow-50/20 transition-all"
                {...register("about")}
                defaultValue={user?.additionalDetails?.about}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
        <button
          type="button"
          onClick={() => navigate("/dashboard/my-profile")}
          className="px-6 py-3 rounded-xl bg-richblack-700 hover:bg-richblack-600 font-semibold text-richblack-50 transition-all border-2 border-transparent hover:border-richblack-500"
        >
          Cancel
        </button>
        <IconBtn type="submit" text="Save Changes" />
      </div>
    </form>
  )
}