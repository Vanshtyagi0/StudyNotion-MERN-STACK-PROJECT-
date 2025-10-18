import { RiEditBoxLine } from "react-icons/ri";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { formattedDate } from "../../../utils/dateFormatter";
import IconBtn from "../../common/IconBtn";

export default function MyProfile() {
  const { user } = useSelector((state) => state.profile);
  const navigate = useNavigate();

  return (
    <>
      <h1 className="mb-10 text-2xl sm:text-3xl font-medium text-richblack-5 text-center sm:text-left">
        My Profile
      </h1>

      {/* Section 1 */}
      <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between gap-6 rounded-md border border-richblack-700 bg-richblack-800 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <img
            src={user?.image}
            alt={`profile-${user?.firstName}`}
            className="aspect-square w-20 sm:w-[78px] rounded-full object-cover"
          />
          <div className="space-y-1">
            <p className="text-lg font-semibold text-richblack-5">
              {user?.firstName + " " + user?.lastName}
            </p>
            <p className="text-sm text-richblack-300">{user?.email}</p>
          </div>
        </div>

        <div className="w-full sm:w-auto flex justify-center sm:justify-end">
          <IconBtn
            text="Edit"
            onclick={() => navigate("/dashboard/settings")}
          >
            <RiEditBoxLine />
          </IconBtn>
        </div>
      </div>

      {/* Section 2 */}
      <div className="my-8 sm:my-10 flex flex-col gap-y-6 rounded-md border border-richblack-700 bg-richblack-800 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row w-full items-center justify-between gap-3">
          <p className="text-lg font-semibold text-richblack-5">About</p>
          <IconBtn
            text="Edit"
            onclick={() => navigate("/dashboard/settings")}
          >
            <RiEditBoxLine />
          </IconBtn>
        </div>

        <p
          className={`${
            user?.additionalDetails?.about
              ? "text-richblack-5"
              : "text-richblack-400"
          } text-sm font-medium text-center sm:text-left`}
        >
          {user?.additionalDetails?.about ?? "Write Something About Yourself"}
        </p>
      </div>

      {/* Section 3 */}
      <div className="my-8 sm:my-10 flex flex-col gap-y-6 rounded-md border border-richblack-700 bg-richblack-800 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row w-full items-center justify-between gap-3">
          <p className="text-lg font-semibold text-richblack-5">
            Personal Details
          </p>
          <IconBtn
            text="Edit"
            onclick={() => navigate("/dashboard/settings")}
          >
            <RiEditBoxLine />
          </IconBtn>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-8 sm:gap-10">
          {/* Left Column */}
          <div className="flex flex-col gap-y-4 sm:gap-y-5">
            <div>
              <p className="mb-1 text-sm text-richblack-600">First Name</p>
              <p className="text-sm font-medium text-richblack-5">
                {user?.firstName}
              </p>
            </div>
            <div>
              <p className="mb-1 text-sm text-richblack-600">Email</p>
              <p className="text-sm font-medium text-richblack-5">
                {user?.email}
              </p>
            </div>
            <div>
              <p className="mb-1 text-sm text-richblack-600">Gender</p>
              <p className="text-sm font-medium text-richblack-5">
                {user?.additionalDetails?.gender ?? "Add Gender"}
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-y-4 sm:gap-y-5">
            <div>
              <p className="mb-1 text-sm text-richblack-600">Last Name</p>
              <p className="text-sm font-medium text-richblack-5">
                {user?.lastName}
              </p>
            </div>
            <div>
              <p className="mb-1 text-sm text-richblack-600">Phone Number</p>
              <p className="text-sm font-medium text-richblack-5">
                {user?.additionalDetails?.contactNumber ?? "Add Contact Number"}
              </p>
            </div>
            <div>
              <p className="mb-1 text-sm text-richblack-600">Date Of Birth</p>
              <p className="text-sm font-medium text-richblack-5">
                {formattedDate(user?.additionalDetails?.dateOfBirth) ??
                  "Add Date Of Birth"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
