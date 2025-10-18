import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { fetchInstructorCourses } from "../../../../services/operations/courseDetailsAPI";
import { getInstructorData } from "../../../../services/operations/profileAPI";
import InstructorChart from "./InstructorChart";
import { Link } from "react-router-dom";

export default function Instructor() {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const [loading, setLoading] = useState(false);
  const [instructorData, setInstructorData] = useState(null);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const instructorApiData = await getInstructorData(token);
      const result = await fetchInstructorCourses(token);

      if (instructorApiData.courses.length) {
        setInstructorData(instructorApiData.courses);
      }
      if (result) {
        setCourses(result);
      }
      setLoading(false);
    })();
  }, [token]);

  const totalAmount = instructorData?.reduce(
    (acc, curr) => acc + curr.totalAmountGenerated,
    0
  );

  const totalStudents = instructorData?.reduce(
    (acc, curr) => acc + curr.totalStudentsEnrolled,
    0
  );

  return (
    <div className="space-y-6 px-2 sm:px-4 md:px-6">
      {/* Greeting */}
      <div className="space-y-2">
        <h1 className="text-xl sm:text-2xl font-bold text-richblack-5">
          Hi {user?.firstName} 👋
        </h1>
        <p className="font-medium text-richblack-200 text-sm sm:text-base">
          Let's start something new
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="spinner"></div>
        </div>
      ) : courses.length > 0 ? (
        <div className="space-y-6">
          {/* Chart + Stats Section */}
          <div className="flex flex-col lg:flex-row gap-4 h-auto lg:h-[450px]">
            {/* Chart */}
            {totalAmount > 0 || totalStudents > 0 ? (
              <div className="flex-1 bg-richblack-800 rounded-md p-4 sm:p-6">
                <InstructorChart courses={instructorData} />
              </div>
            ) : (
              <div className="flex-1 rounded-md bg-richblack-800 p-6 flex flex-col justify-center items-center text-center">
                <p className="text-lg font-bold text-richblack-5">Visualize</p>
                <p className="mt-4 text-base sm:text-xl font-medium text-richblack-50">
                  Not Enough Data To Visualize
                </p>
              </div>
            )}

            {/* Statistics */}
            <div className="min-w-full lg:min-w-[250px] rounded-md bg-richblack-800 p-6 flex flex-col justify-between">
              <p className="text-lg font-bold text-richblack-5 mb-4">Statistics</p>
              <div className="space-y-4">
                <div>
                  <p className="text-richblack-200 text-sm sm:text-base">Total Courses</p>
                  <p className="text-2xl sm:text-3xl font-semibold text-richblack-50">
                    {courses.length}
                  </p>
                </div>
                <div>
                  <p className="text-richblack-200 text-sm sm:text-base">Total Students</p>
                  <p className="text-2xl sm:text-3xl font-semibold text-richblack-50">
                    {totalStudents}
                  </p>
                </div>
                <div>
                  <p className="text-richblack-200 text-sm sm:text-base">Total Income</p>
                  <p className="text-2xl sm:text-3xl font-semibold text-richblack-50">
                    ₹ {totalAmount}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Courses Section */}
          <div className="rounded-md bg-richblack-800 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <p className="text-lg font-bold text-richblack-5">Your Courses</p>
              <Link to="/dashboard/my-courses">
                <p className="text-xs sm:text-sm font-semibold text-yellow-50">
                  View All
                </p>
              </Link>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.slice(0, 3).map((course) => (
                <div key={course._id} className="bg-richblack-900 rounded-md overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.courseName}
                    className="h-[180px] sm:h-[200px] w-full object-cover"
                  />
                  <div className="p-3 sm:p-4">
                    <p className="text-sm font-medium text-richblack-50 line-clamp-1">
                      {course.courseName}
                    </p>
                    <div className="mt-2 flex items-center text-xs text-richblack-300 gap-2">
                      <span>{course.studentEnrolled.length} students</span>
                      <span>|</span>
                      <span>₹ {course.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-10 sm:mt-20 rounded-md bg-richblack-800 p-6 sm:py-20">
          <p className="text-center text-lg sm:text-2xl font-bold text-richblack-5">
            You have not created any courses yet
          </p>
          <Link to="/dashboard/add-course">
            <p className="mt-2 text-center text-base sm:text-lg font-semibold text-yellow-50">
              Create a course
            </p>
          </Link>
        </div>
      )}
    </div>
  );
}
