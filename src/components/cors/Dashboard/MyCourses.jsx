import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { VscAdd } from "react-icons/vsc";

import { fetchInstructorCourses } from "../../../services/operations/courseDetailsAPI";
import IconBtn from "../../common/IconBtn";
import CoursesTable from "./InstructorCourses/CoursesTable";

const MyCourses = () => {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [courses, setCourses] = useState();

  useEffect(() => {
    const fetchCourses = async () => {
      const result = await fetchInstructorCourses(token);
      if (result) {
        setCourses(result);
      }
    };
    fetchCourses();
  }, [token]);

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 py-6">
      {/* Header Section */}
      <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-semibold text-richblack-5 text-center sm:text-left">
          My Courses
        </h1>

        <div className="flex justify-center sm:justify-end">
          <IconBtn
            text="Add Course"
            onclick={() => navigate("/dashboard/add-course")}
            className="w-full sm:w-auto"
          >
            <VscAdd className="text-lg" />
          </IconBtn>
        </div>
      </div>

      {/* Courses Table */}
      <div className="overflow-x-auto rounded-lg border border-richblack-700 shadow-md">
        {courses ? (
          <CoursesTable courses={courses} setCourses={setCourses} />
        ) : (
          <p className="text-richblack-300 text-center py-6 text-sm sm:text-base">
            Loading your courses...
          </p>
        )}
      </div>
    </div>
  );
};

export default MyCourses;
