import React, { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { changePassword } from "../../../../services/operations/SettingsAPI"
import IconBtn from "../../../common/IconBtn"

export default function UpdatePassword() {
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()

  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm()

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        oldPassword: "",
        newPassword: ""
      })
    }
  }, [reset, isSubmitSuccessful])

  const submitPasswordForm = async (data) => {
    try {
      await changePassword(token, data)
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message)
    }
  }

  return (
    <form onSubmit={handleSubmit(submitPasswordForm)} className="space-y-6">
      {/* Password Update Card */}
      <div className="rounded-2xl border-2 border-richblack-700 bg-richblack-800 overflow-hidden transition-all hover:border-richblack-600 hover:shadow-lg">
        {/* Header */}
        <div className="px-6 md:px-8 py-4 bg-richblack-900/50 border-b border-richblack-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
              <svg 
                className="w-5 h-5 text-yellow-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
                />
              </svg>
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-richblack-5">
                Password & Security
              </h2>
              <p className="text-xs md:text-sm text-richblack-400 mt-0.5">
                Update your password to keep your account secure
              </p>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Current Password */}
            <div className="space-y-2 md:col-span-1">
              <label 
                htmlFor="oldPassword" 
                className="text-sm font-medium text-richblack-300 flex items-center gap-1"
              >
                Current Password
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showOldPassword ? "text" : "password"}
                  name="oldPassword"
                  id="oldPassword"
                  placeholder="Enter current password"
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-richblack-700 border-2 border-richblack-600 text-richblack-5 placeholder-richblack-400 focus:outline-none focus:border-yellow-50 focus:ring-2 focus:ring-yellow-50/20 transition-all"
                  {...register("oldPassword", { required: true })}
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-richblack-600 rounded-lg transition-colors"
                >
                  {showOldPassword ? (
                    <AiOutlineEyeInvisible fontSize={20} className="text-richblack-400" />
                  ) : (
                    <AiOutlineEye fontSize={20} className="text-richblack-400" />
                  )}
                </button>
              </div>
              {errors.oldPassword && (
                <span className="text-xs text-red-400 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Please enter your current password
                </span>
              )}
            </div>

            {/* New Password */}
            <div className="space-y-2 md:col-span-1">
              <label 
                htmlFor="newPassword" 
                className="text-sm font-medium text-richblack-300 flex items-center gap-1"
              >
                New Password
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  id="newPassword"
                  placeholder="Enter new password"
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-richblack-700 border-2 border-richblack-600 text-richblack-5 placeholder-richblack-400 focus:outline-none focus:border-yellow-50 focus:ring-2 focus:ring-yellow-50/20 transition-all"
                  {...register("newPassword", { required: true })}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-richblack-600 rounded-lg transition-colors"
                >
                  {showNewPassword ? (
                    <AiOutlineEyeInvisible fontSize={20} className="text-richblack-400" />
                  ) : (
                    <AiOutlineEye fontSize={20} className="text-richblack-400" />
                  )}
                </button>
              </div>
              {errors.newPassword && (
                <span className="text-xs text-red-400 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Please enter your new password
                </span>
              )}
            </div>
          </div>

          {/* Password Requirements */}
          <div className="mt-6 p-4 rounded-xl bg-richblack-700/50 border border-richblack-600">
            <p className="text-xs font-semibold text-richblack-300 mb-2">
              Password Requirements:
            </p>
            <ul className="space-y-1 text-xs text-richblack-400">
              <li className="flex items-center gap-2">
                <svg className="w-3 h-3 text-richblack-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                At least 8 characters long
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-3 h-3 text-richblack-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Include uppercase and lowercase letters
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-3 h-3 text-richblack-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Include at least one number or special character
              </li>
            </ul>
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
        <IconBtn type="submit" text="Update Password" />
      </div>
    </form>
  )
}