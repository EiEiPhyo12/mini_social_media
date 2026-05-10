function EditProfileModal({
  editOpen,
  setEditOpen,
  preview,
  username,
  setUsername,
  bio,
  setBio,
  saving,
  handleImageChange,
  handleUpdateProfile,
}) {

  if (!editOpen) return null;

  return (

    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">

      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-6">

        <h2 className="text-xl font-bold mb-5">
          Edit Profile
        </h2>

        <div className="flex justify-center mb-5">

          <img
            src={
              preview ||
              "https://via.placeholder.com/120"
            }
            alt="preview"
            className="w-28 h-28 rounded-full object-cover border-4 border-slate-200"
          />

        </div>

        <div className="mb-4">

          <label className="block text-sm font-medium text-slate-700 mb-2">
            Upload Avatar
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border border-slate-300 rounded-xl p-2"
          />

        </div>

        <div className="mb-4">

          <label className="block text-sm font-medium text-slate-700 mb-2">
            Username
          </label>

          <input
            type="text"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
            className="w-full border border-slate-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-900"
          />

        </div>

        <div className="mb-5">

          <label className="block text-sm font-medium text-slate-700 mb-2">
            Bio
          </label>

          <textarea
            value={bio}
            onChange={(e) =>
              setBio(e.target.value)
            }
            rows={4}
            placeholder="Write something..."
            className="w-full border border-slate-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-900"
          />

        </div>

        <div className="flex justify-end gap-3">

          <button
            onClick={() =>
              setEditOpen(false)
            }
            className="px-4 py-2 rounded-xl bg-slate-200"
          >
            Cancel
          </button>

          <button
            onClick={handleUpdateProfile}
            disabled={saving}
            className="px-5 py-2 rounded-xl bg-blue-900 text-white hover:opacity-90"
          >
            {saving ? "Saving..." : "Save"}
          </button>

        </div>

      </div>

    </div>
  );
}

export default EditProfileModal;