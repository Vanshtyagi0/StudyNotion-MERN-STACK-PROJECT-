import ChangeProfilePicture from "./ChangeProfilePicture"
import DeleteAccount from "./DeleteAccount"
import EditProfile from "./EditProfile"
import UpdatePassword from "./UpdatePassword"

export default function Settings() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header Section */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-richblack-5 tracking-tight mb-2">
          Settings
        </h1>
        <p className="text-richblack-400 text-sm md:text-base">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Settings Grid */}
      <div className="space-y-6">
        {/* Change Profile Picture */}
        <section className="animate-fadeIn">
          <ChangeProfilePicture />
        </section>

        {/* Profile Information */}
        <section className="animate-fadeIn" style={{ animationDelay: '0.1s' }}>
          <EditProfile />
        </section>

        {/* Password & Security */}
        <section className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
          <UpdatePassword />
        </section>

        {/* Danger Zone */}
        <section className="animate-fadeIn" style={{ animationDelay: '0.3s' }}>
          <div className="rounded-2xl border-2 border-red-800/50 bg-gradient-to-br from-red-950/30 to-richblack-900 p-1">
            <div className="rounded-xl bg-richblack-900/80 p-4 md:p-6">
              <div className="flex items-center gap-3 mb-4 text-white">
                <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <svg 
                    className="w-5 h-5 text-red-500" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-red-500">Danger Zone</h3>
                  <p className="text-xs text-richblack-400">Irreversible actions</p>
                </div>
              </div>
              <DeleteAccount />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}