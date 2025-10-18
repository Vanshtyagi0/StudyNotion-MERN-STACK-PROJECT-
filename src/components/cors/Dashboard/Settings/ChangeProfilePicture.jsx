import { useEffect, useRef, useState } from "react"
import { FiUpload, FiCamera } from "react-icons/fi"
import { useDispatch, useSelector } from "react-redux"

import { updateDisplayPicture } from "../../../../services/operations/SettingsAPI"
import IconBtn from "../../../common/IconBtn"

export default function ChangeProfilePicture() {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [previewSource, setPreviewSource] = useState(null)

  const fileInputRef = useRef(null)

  const handleClick = () => {
    fileInputRef.current.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      previewFile(file)
    }
  }

  const previewFile = (file) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
      setPreviewSource(reader.result)
    }
  }

  const handleFileUpload = () => {
    if (!imageFile) return
    try {
      console.log("uploading...")
      setLoading(true)
      const formData = new FormData()
      formData.append("displayPicture", imageFile)
      dispatch(updateDisplayPicture(token, formData)).then(() => {
        setLoading(false)
      })
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message)
    }
  }

  useEffect(() => {
    if (imageFile) {
      previewFile(imageFile)
    }
  }, [imageFile])

  return (
    <div className="rounded-2xl border-2 border-richblack-700 bg-richblack-800 overflow-hidden transition-all hover:border-richblack-600 hover:shadow-lg">
      {/* Header */}
      <div className="px-6 md:px-8 py-4 bg-richblack-900/50 border-b border-richblack-700">
        <h3 className="text-lg md:text-xl font-bold text-richblack-5">
          Profile Picture
        </h3>
        <p className="text-xs md:text-sm text-richblack-400 mt-1">
          Update your profile picture
        </p>
      </div>

      {/* Content */}
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Profile Picture Preview */}
          <div className="relative group">
            <div className="relative">
              <img
                src={previewSource || user?.image}
                alt={`profile-${user?.firstName}`}
                className="w-24 h-24 md:w-28 md:h-28 rounded-2xl object-cover ring-4 ring-richblack-700 transition-all group-hover:ring-richblack-600"
              />
              
              {/* Overlay on Hover */}
              <div 
                onClick={handleClick}
                className="absolute inset-0 rounded-2xl bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center"
              >
                <FiCamera className="text-white text-2xl" />
              </div>

              {/* Loading Overlay */}
              {loading && (
                <div className="absolute inset-0 rounded-2xl bg-black/70 flex items-center justify-center">
                  <div className="w-8 h-8 border-3 border-richblack-400 border-t-yellow-50 rounded-full animate-spin"></div>
                </div>
              )}
            </div>

            {/* New Badge */}
            {previewSource && !loading && (
              <div className="absolute -top-2 -right-2 px-2 py-1 bg-blue-500 text-white text-xs font-bold rounded-full">
                NEW
              </div>
            )}
          </div>

          {/* Upload Controls */}
          <div className="flex-1 w-full md:w-auto">
            <div className="space-y-4">
              {/* File Info */}
              <div>
                <p className="text-sm font-medium text-richblack-300 mb-2">
                  {imageFile ? (
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      {imageFile.name}
                    </span>
                  ) : (
                    "No file selected"
                  )}
                </p>
                <p className="text-xs text-richblack-500">
                  Supported: JPG, PNG, GIF (Max 5MB)
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/png, image/gif, image/jpeg"
                />
                
                <button
                  onClick={handleClick}
                  disabled={loading}
                  className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-richblack-700 hover:bg-richblack-600 font-semibold text-richblack-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed border-2 border-transparent hover:border-richblack-500"
                >
                  Choose File
                </button>

                <button
                  onClick={handleFileUpload}
                  disabled={loading || !imageFile}
                  className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-yellow-50 hover:bg-yellow-100 font-semibold text-richblack-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-richblack-900 border-t-transparent rounded-full animate-spin"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <FiUpload className="text-lg" />
                      Upload
                    </>
                  )}
                </button>
              </div>

              {/* Success Message */}
              {!loading && previewSource && (
                <div className="flex items-center gap-2 text-xs text-green-400 bg-green-500/10 px-3 py-2 rounded-lg">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Ready to upload
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}