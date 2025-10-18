import { useSelector } from "react-redux"
import { useState } from "react"
import { FaCheck } from "react-icons/fa"
import { FiEdit2 } from "react-icons/fi"
import { HiClock } from "react-icons/hi"
import { RiDeleteBin6Line } from "react-icons/ri"
import { useNavigate } from "react-router-dom"

import {
  deleteCourse,
  fetchInstructorCourses,
} from "../../../../services/operations/courseDetailsAPI"
import { COURSE_STATUS } from "../../../../utils/Constants"
import ConfirmationModal from "../../../common/ConfirmationModal"
import { formatDate } from "../../../../services/formatDate"

export default function CoursesTable({ courses, setCourses }) {
  
  const navigate = useNavigate()
  const { token } = useSelector((state) => state.auth)
  const [loading, setLoading] = useState(false)
  const [confirmationModal, setConfirmationModal] = useState(null)
  const TRUNCATE_LENGTH = 30

  const handleCourseDelete = async (courseId) => {
    setLoading(true)
    await deleteCourse({ courseId: courseId }, token)
    const result = await fetchInstructorCourses(token)
    if (result) {
      setCourses(result)
    }
    setConfirmationModal(null)
    setLoading(false)
  }

  return (
    <>
      <div className="rounded-xl border border-richblack-800 overflow-hidden">
        {/* Desktop Table View - Hidden on Mobile */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-b-richblack-800 bg-richblack-800">
                <th className="text-left text-sm font-medium uppercase text-richblack-100 px-6 py-3">
                  Courses
                </th>
                <th className="text-left text-sm font-medium uppercase text-richblack-100 px-6 py-3 whitespace-nowrap">
                  Duration
                </th>
                <th className="text-left text-sm font-medium uppercase text-richblack-100 px-6 py-3">
                  Price
                </th>
                <th className="text-left text-sm font-medium uppercase text-richblack-100 px-6 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {courses?.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-10 text-center text-2xl font-medium text-richblack-100">
                    No courses found
                  </td>
                </tr>
              ) : (
                courses?.map((course) => (
                  <tr
                    key={course._id}
                    className="border-b border-richblack-800 hover:bg-richblack-900 transition-colors"
                  >
                    <td className="px-6 py-8">
                      <div className="flex gap-x-4">
                        <img
                          src={course?.thumbnail}
                          alt={course?.courseName}
                          className="h-[148px] w-[220px] rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex flex-col justify-between">
                          <p className="text-lg font-semibold text-richblack-5">
                            {course.courseName}
                          </p>
                          <p className="text-xs text-richblack-300">
                            {course.courseDescription.split(" ").length >
                            TRUNCATE_LENGTH
                              ? course.courseDescription
                                  .split(" ")
                                  .slice(0, TRUNCATE_LENGTH)
                                  .join(" ") + "..."
                              : course.courseDescription}
                          </p>
                          <p className="text-[12px] text-white">
                            Created: {formatDate(course.createdAt)}
                          </p>
                          {course.status === COURSE_STATUS.DRAFT ? (
                            <p className="flex w-fit flex-row items-center gap-2 rounded-full bg-richblack-700 px-2 py-[2px] text-[12px] font-medium text-pink-100">
                              <HiClock size={14} />
                              Drafted
                            </p>
                          ) : (
                            <div className="flex w-fit flex-row items-center gap-2 rounded-full bg-richblack-700 px-2 py-[2px] text-[12px] font-medium text-yellow-100">
                              <div className="flex h-3 w-3 items-center justify-center rounded-full bg-yellow-100 text-richblack-700">
                                <FaCheck size={8} />
                              </div>
                              Published
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-8 text-sm font-medium text-richblack-100 whitespace-nowrap">
                      2hr 30min
                    </td>
                    <td className="px-6 py-8 text-sm font-medium text-richblack-100">
                      ₹{course.price}
                    </td>
                    <td className="px-6 py-8 text-sm font-medium text-richblack-100">
                      <div className="flex gap-3">
                        <button
                          disabled={loading}
                          onClick={() => {
                            navigate(`/dashboard/edit-course/${course._id}`)
                          }}
                          title="Edit"
                          className="transition-all duration-200 hover:scale-110 hover:text-caribbeangreen-300"
                        >
                          <FiEdit2 size={20} />
                        </button>
                        <button
                          disabled={loading}
                          onClick={() => {
                            setConfirmationModal({
                              text1: "Do you want to delete this course?",
                              text2:
                                "All the data related to this course will be deleted",
                              btn1Text: !loading ? "Delete" : "Loading...  ",
                              btn2Text: "Cancel",
                              btn1Handler: !loading
                                ? () => handleCourseDelete(course._id)
                                : () => {},
                              btn2Handler: !loading
                                ? () => setConfirmationModal(null)
                                : () => {},
                            })
                          }}
                          title="Delete"
                          className="transition-all duration-200 hover:scale-110 hover:text-[#ff0000]"
                        >
                          <RiDeleteBin6Line size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View - Hidden on Desktop */}
        <div className="lg:hidden">
          {courses?.length === 0 ? (
            <div className="py-10 text-center text-xl font-medium text-richblack-100">
              No courses found
            </div>
          ) : (
            <div className="divide-y divide-richblack-800">
              {courses?.map((course) => (
                <div
                  key={course._id}
                  className="p-4 sm:p-6 hover:bg-richblack-900 transition-colors"
                >
                  {/* Course Image */}
                  <img
                    src={course?.thumbnail}
                    alt={course?.courseName}
                    className="w-full h-48 sm:h-56 rounded-lg object-cover mb-4"
                  />

                  {/* Course Info */}
                  <div className="space-y-3">
                    <h3 className="text-lg sm:text-xl font-semibold text-richblack-5">
                      {course.courseName}
                    </h3>
                    
                    <p className="text-sm text-richblack-300 line-clamp-3">
                      {course.courseDescription.split(" ").length >
                      TRUNCATE_LENGTH
                        ? course.courseDescription
                            .split(" ")
                            .slice(0, TRUNCATE_LENGTH)
                            .join(" ") + "..."
                        : course.courseDescription}
                    </p>

                    <p className="text-xs sm:text-[12px] text-white">
                      Created: {formatDate(course.createdAt)}
                    </p>

                    {/* Status Badge */}
                    {course.status === COURSE_STATUS.DRAFT ? (
                      <p className="flex w-fit flex-row items-center gap-2 rounded-full bg-richblack-700 px-3 py-1 text-xs sm:text-[12px] font-medium text-pink-100">
                        <HiClock size={14} />
                        Drafted
                      </p>
                    ) : (
                      <div className="flex w-fit flex-row items-center gap-2 rounded-full bg-richblack-700 px-3 py-1 text-xs sm:text-[12px] font-medium text-yellow-100">
                        <div className="flex h-3 w-3 items-center justify-center rounded-full bg-yellow-100 text-richblack-700">
                          <FaCheck size={8} />
                        </div>
                        Published
                      </div>
                    )}

                    {/* Duration and Price */}
                    <div className="flex items-center justify-between pt-3 border-t border-richblack-700">
                      <div className="flex gap-6 sm:gap-8">
                        <div>
                          <p className="text-xs text-richblack-300 uppercase mb-1">
                            Duration
                          </p>
                          <p className="text-sm font-medium text-richblack-100">
                            2hr 30min
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-richblack-300 uppercase mb-1">
                            Price
                          </p>
                          <p className="text-sm font-medium text-richblack-100">
                            ₹{course.price}
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-4">
                        <button
                          disabled={loading}
                          onClick={() => {
                            navigate(`/dashboard/edit-course/${course._id}`)
                          }}
                          title="Edit"
                          className="p-2 transition-all duration-200 hover:scale-110 hover:text-caribbeangreen-300 active:scale-95"
                          aria-label="Edit course"
                        >
                          <FiEdit2 size={22} />
                        </button>
                        <button
                          disabled={loading}
                          onClick={() => {
                            setConfirmationModal({
                              text1: "Do you want to delete this course?",
                              text2:
                                "All the data related to this course will be deleted",
                              btn1Text: !loading ? "Delete" : "Loading...  ",
                              btn2Text: "Cancel",
                              btn1Handler: !loading
                                ? () => handleCourseDelete(course._id)
                                : () => {},
                              btn2Handler: !loading
                                ? () => setConfirmationModal(null)
                                : () => {},
                            })
                          }}
                          title="Delete"
                          className="p-2 transition-all duration-200 hover:scale-110 hover:text-[#ff0000] active:scale-95"
                          aria-label="Delete course"
                        >
                          <RiDeleteBin6Line size={22} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  )
}