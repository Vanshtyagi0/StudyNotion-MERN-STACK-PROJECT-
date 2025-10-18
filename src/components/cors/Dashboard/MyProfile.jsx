import { RiEditBoxLine } from "react-icons/ri";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { formattedDate } from "../../../utils/dateFormatter";
import IconBtn from "../../common/IconBtn";

export default function MyProfile() {
  const { user } = useSelector((state) => state.profile);
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="mb-8 text-3xl md:text-4xl font-bold text-richblack-5 tracking-tight">
        My Profile
      </h1>

      <div className="space-y-6">
        {/* Section 1 - Profile Header */}
        <div className="group relative overflow-hidden rounded-2xl border-2 border-richblack-700 bg-gradient-to-br from-richblack-800 to-richblack-900 p-6 md:p-8 transition-all hover:border-richblack-600 hover:shadow-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-5 w-full md:w-auto">
              <div className="relative">
                <img
                  src={user?.image}
                  alt={`profile-${user?.firstName}`}
                  className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover ring-4 ring-richblack-700 transition-transform group-hover:scale-105"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <h2 className="text-xl md:text-2xl font-bold text-richblack-5 truncate">
                  {user?.firstName + " " + user?.lastName}
                </h2>
                <p className="text-sm md:text-base text-richblack-400 truncate mt-1">
                  {user?.email}
                </p>
              </div>
            </div>

            <IconBtn
              text="Edit"
              onclick={() => navigate("/dashboard/settings")}
            >
              <RiEditBoxLine />
            </IconBtn>
          </div>
        </div>

        {/* Section 2 - About */}
        <div className="rounded-2xl border-2 border-richblack-700 bg-richblack-800 overflow-hidden transition-all hover:border-richblack-600 hover:shadow-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6 md:px-8 py-5 bg-richblack-900/50 border-b border-richblack-700">
            <h3 className="text-lg md:text-xl font-bold text-richblack-5">About</h3>
            <IconBtn
              text="Edit"
              onclick={() => navigate("/dashboard/settings")}
            >
              <RiEditBoxLine />
            </IconBtn>
          </div>

          <div className="px-6 md:px-8 py-6">
            <p className={`${
                user?.additionalDetails?.about
                  ? "text-richblack-300"
                  : "text-richblack-500 italic"
              } text-sm md:text-base leading-relaxed`}
            >
              {user?.additionalDetails?.about ?? "Write something about yourself to let others know more about you."}
            </p>
          </div>
        </div>

        {/* Section 3 - Personal Details */}
        <div className="rounded-2xl border-2 border-richblack-700 bg-richblack-800 overflow-hidden transition-all hover:border-richblack-600 hover:shadow-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6 md:px-8 py-5 bg-richblack-900/50 border-b border-richblack-700">
            <h3 className="text-lg md:text-xl font-bold text-richblack-5">
              Personal Details
            </h3>
            <IconBtn
              text="Edit"
              onclick={() => navigate("/dashboard/settings")}
            >
              <RiEditBoxLine />
            </IconBtn>
          </div>

          <div className="px-6 md:px-8 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* First Name */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-richblack-500 uppercase tracking-wide">
                  First Name
                </label>
                <p className="text-base md:text-lg font-medium text-richblack-5">
                  {user?.firstName}
                </p>
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-richblack-500 uppercase tracking-wide">
                  Last Name
                </label>
                <p className="text-base md:text-lg font-medium text-richblack-5">
                  {user?.lastName}
                </p>
              </div>

              {/* Email */}
              <div className="space-y-2 md:col-span-2 lg:col-span-1">
                <label className="text-xs font-semibold text-richblack-500 uppercase tracking-wide">
                  Email
                </label>
                <p className="text-base md:text-lg font-medium text-richblack-5 truncate">
                  {user?.email}
                </p>
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-richblack-500 uppercase tracking-wide">
                  Phone Number
                </label>
                <p className={`text-base md:text-lg font-medium ${
                  user?.additionalDetails?.contactNumber 
                    ? "text-richblack-5" 
                    : "text-richblack-500 italic"
                }`}>
                  {user?.additionalDetails?.contactNumber ?? "Add Contact Number"}
                </p>
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-richblack-500 uppercase tracking-wide">
                  Gender
                </label>
                <p className={`text-base md:text-lg font-medium ${
                  user?.additionalDetails?.gender 
                    ? "text-richblack-5" 
                    : "text-richblack-500 italic"
                }`}>
                  {user?.additionalDetails?.gender ?? "Add Gender"}
                </p>
              </div>

              {/* Date of Birth */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-richblack-500 uppercase tracking-wide">
                  Date Of Birth
                </label>
                <p className={`text-base md:text-lg font-medium ${
                  user?.additionalDetails?.dateOfBirth 
                    ? "text-richblack-5" 
                    : "text-richblack-500 italic"
                }`}>
                  {formattedDate(user?.additionalDetails?.dateOfBirth) ??
                    "Add Date Of Birth"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}