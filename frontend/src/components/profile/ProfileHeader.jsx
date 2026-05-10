function ProfileHeader({
  user,
  postsCount,
  openEditModal,
}) {

  return (

    <div className="bg-white rounded-3xl shadow p-8">

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

        <div className="flex items-center gap-5">

          {user.avatar ? (
            <img
              src={user.avatar}
              alt="avatar"
              className="w-28 h-28 rounded-full object-cover border-4 border-slate-200"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-blue-900 text-white flex items-center justify-center font-semibold">
              {user?.username?.charAt(0).toUpperCase() || "U"}
            </div>
          )}


          <div>

            <h1 className="text-2xl font-bold text-slate-800">
              {user?.username}
            </h1>

            <p className="text-slate-600 mt-2 max-w-md">
              {user?.bio || "No bio yet"}
            </p>

            <div className="flex items-center gap-6 mt-3">

              <div>

                <p className="text-xl font-bold text-slate-800">
                  {postsCount}
                </p>

                <p className="text-sm text-slate-500">
                  Posts
                </p>

              </div>

            </div>

          </div>

        </div>

        <button
          onClick={openEditModal}
          className="bg-blue-900 text-white px-5 py-3 rounded-xl hover:opacity-90"
        >
          Edit Profile
        </button>

      </div>

    </div>
  );
}

export default ProfileHeader;