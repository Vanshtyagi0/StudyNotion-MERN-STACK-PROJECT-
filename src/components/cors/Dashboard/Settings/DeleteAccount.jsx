import { useState } from "react"
import { FiTrash2, FiAlertTriangle } from "react-icons/fi"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { deleteProfile } from "../../../../services/operations/SettingsAPI"

export default function DeleteAccount() {
  const { token } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [showConfirmation, setShowConfirmation] = useState(false)

  async function handleDeleteAccount() {
    try {
      dispatch(deleteProfile(token, navigate))
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message)
    }
  }

  return (
    <>
      <div className="space-y-4">
        {/* Delete Account Card */}
        <div className="rounded-2xl border-2 border-pink-700/70 bg-gradient-to-br from-red-950/60 to-richblack-900 overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="flex flex-col sm:flex-row gap-5">
              {/* Icon */}
              <div className="flex-shrink-0">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-red-500/20 border-2 border-pink-500/30 flex items-center justify-center">
                  <FiTrash2 className="text-2xl sm:text-3xl text-pink-800" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 space-y-4">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-richblack-5 mb-2">
                    Delete Account
                  </h2>
                  <p className="text-sm md:text-base text-richblack-300 leading-relaxed">
                    Would you like to delete your account?
                  </p>
                </div>

                {/* Warning Box */}
                <div className="p-4 rounded-xl bg-pink-500/10 border border-pink-500/20">
                  <div className="flex items-start gap-3">
                    <FiAlertTriangle className="text-red-400 text-lg mt-0.5 flex-shrink-0" />
                    <div className="space-y-2 text-sm text-richblack-300">
                      <p className="font-medium text-red-300">
                        This action is permanent and cannot be undone.
                      </p>
                      <ul className="space-y-1 list-disc list-inside text-xs">
                        <li>Your account may contain paid courses</li>
                        <li>All content associated with your account will be removed</li>
                        <li>You will lose access to all purchased materials</li>
                        <li>Your data cannot be recovered after deletion</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => setShowConfirmation(true)}
                  className="px-5 py-2.5 rounded-xl bg-pink-600 hover:bg-red-500 font-semibold text-white transition-all flex items-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <FiTrash2 className="text-lg" />
                  Delete My Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-richblack-800 rounded-2xl border-2 border-red-700 max-w-md w-full overflow-hidden animate-fadeIn">
            {/* Modal Header */}
            <div className="p-6 bg-pink-950/30 border-b border-pink-700/50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                  <FiAlertTriangle className="text-2xl text-pink-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-richblack-5">
                    Confirm Account Deletion
                  </h3>
                  <p className="text-xs text-richblack-400 mt-0.5">
                    This action cannot be undone
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              <p className="text-sm text-richblack-300 leading-relaxed">
                Are you absolutely sure you want to delete your account? This will:
              </p>
              
              <ul className="space-y-2 text-sm text-richblack-400">
                <li className="flex items-start gap-2">
                  <span className="text-pink-400 mt-0.5">×</span>
                  <span>Permanently delete all your data</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-400 mt-0.5">×</span>
                  <span>Remove access to all purchased courses</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-400 mt-0.5">×</span>
                  <span>Cancel any active subscriptions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-400 mt-0.5">×</span>
                  <span>Erase all progress and certificates</span>
                </li>
              </ul>

              <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <p className="text-xs text-yellow-200 font-medium">
                  💡 Consider downloading your data before deletion
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-6 bg-richblack-900/50 border-t border-richblack-700 flex flex-col-reverse sm:flex-row gap-3">
              <button
                onClick={() => setShowConfirmation(false)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-richblack-700 hover:bg-richblack-600 font-semibold text-richblack-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 px-4 py-2.5 rounded-xl bg-pink-600 hover:bg-red-500 font-semibold text-white transition-all flex items-center justify-center gap-2"
              >
                <FiTrash2 />
                Yes, Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}