import { Route, Routes, useNavigate } from "react-router-dom";
import { Home } from "./Pages/Home";
import "./App.css";
import Signup from './Pages/Signup';
import Login from './Pages/Login';
import Navbar from "./components/common/Navbar";
import ForgotPassword from "./Pages/ForgotPassword";
import UpdatePassword from "./Pages/UpdatePassword";
import VerifyEmail from "./Pages/VerifyEmail";
import About from "./Pages/About";
import Dashboard from "./Pages/Dashboard";
import MyProfile from "./components/cors/Dashboard/MyProfile";
import PrivateRoute from "./components/cors/auth/PrivateRoute";
import OpenRoute from "./components/cors/auth/OpenRoute"
import Error from "./Pages/Error";
import Contact from "./Pages/Contact";
import Settings from "./components/cors/Dashboard/Settings"
import EnrolledCourses from "./components/cors/Dashboard/EnrolledCourses";
import Cart from "./components/cors/Dashboard/Cart";
import { useDispatch, useSelector } from "react-redux";
import { ACCOUNT_TYPE } from "./utils/Constants";
import AddCourse from "./components/cors/Dashboard/AddCourses";
import MyCourses from "./components/cors/Dashboard/MyCourses";
import EditCourse from "./components/cors/Dashboard/EditCourse"
import Catalog from "./Pages/Catalog";
import Instructor from "./components/cors/Dashboard/InstructorDashboard/Instructor";
import CourseDetails from "./Pages/CourseDetails";
import ViewCourse from "./Pages/ViewCourse";
import VideoDetails from "./components/cors/ViewCourse/VideoDetails";

function App() {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { user } = useSelector((state) => state.profile)

  return (
    <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
      <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="catalog/:catalogName" element={<Catalog />} />
          <Route path="courses/:courseId" element={<CourseDetails />} />
          <Route path ="about" element={ <About /> } />

          <Route
            path="signup"
            element={
              <OpenRoute>
                <Signup />
              </OpenRoute>
            }
          />

          <Route
            path="login"
            element={
              <OpenRoute>
                <Login />
              </OpenRoute>
            }
          />

          <Route
            path="forgot-password"
            element={
              <OpenRoute>
                <ForgotPassword />
              </OpenRoute>
            }
          />

          <Route
            path="update-password/:id"
            element={
              <OpenRoute>
                <UpdatePassword />
              </OpenRoute>
            }
          />

          <Route
            path="verify-email"
            element={
              <OpenRoute>
                <VerifyEmail />
              </OpenRoute>
            }
          />

          
          <Route 
            path="contact"
            element={
              <Contact />
            }
          />
          
          <Route
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          >
            <Route path="dashboard/my-profile" element={<MyProfile />} />
            <Route path="dashboard/settings" element={<Settings />} />

             {
              user?.accountType === ACCOUNT_TYPE.STUDENT && (
                <>
                <Route path="dashboard/cart" element={<Cart />} />
                <Route path="dashboard/enrolled-courses" element={<EnrolledCourses />} />
                </>
              )
            }
            {
              user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
                <>
                  <Route path="dashboard/instructor" element={<Instructor />} />
                  <Route path="dashboard/add-course" element={<AddCourse />} />
                  <Route path="dashboard/my-courses" element={<MyCourses />} />
                  <Route path="dashboard/edit-course/:courseId" element={<EditCourse />} />
                </>
              )
            }   
          </Route>

          <Route 
            element={
              <PrivateRoute>
                <ViewCourse />
              </PrivateRoute>
            }
          >
            {
              user?.accountType === ACCOUNT_TYPE.STUDENT && (
                <>
                  <Route 
                    path="view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
                    element = {<VideoDetails />}
                  />
                </>
              )
            }
          </Route>

          <Route path="*" element={<Error />} />

        </Routes>
    </div>
  );
}

export default App;
