import ChangeProfilePicture from "./ChangeProfilePicture"
import DeleteAccount from "./DeleteAccount"
import EditProfile from "./EditProfile"
import UpdatePassword from "./UpdatePassword"

export default function Settings(){
    return(
        <div>

            <h1 className="text-richblack-5 mb-14 font-medium text-3xl">Edit Profile</h1>

            {/* Change Profile Picture */}
            <ChangeProfilePicture />
             {/* Profile */}
            <EditProfile />
            {/* Password */}
            <UpdatePassword />
            {/* Delete Account */}
            <DeleteAccount />
        </div>
    )
}