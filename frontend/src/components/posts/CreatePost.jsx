import { useState } from "react";
import API from "../../services/api";

function CreatePost({ user, fetchPosts }) {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  // ======================
  // HANDLE IMAGE
  // ======================

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // ======================
  // CREATE POST
  // ======================

  const handleCreatePost = async () => {
    if (!content.trim() && !image) return;

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("content", content);

      if (image) {
        formData.append("image", image);
      }

      await API.post("/posts", formData);

      await fetchPosts();

      setContent("");
      setImage(null);
      setPreview("");

    } catch (err) {
      console.error(err);
      alert("Failed to create post");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow p-4">

      <div className="flex items-start gap-3">

        {/* USER AVATAR */}
        <div
          className="
            w-10
            h-10
            rounded-full
            overflow-hidden
            bg-blue-900
            text-white
            flex
            items-center
            justify-center
            font-semibold
            shrink-0
          "
        >
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt="profile"
              className="
                w-full
                h-full
                object-cover
              "
            />
          ) : (
            <span>
              {user?.username?.charAt(0).toUpperCase() || "U"}
            </span>
          )}
        </div>

        {/* TEXTAREA */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className="
            flex-1
            bg-slate-100
            px-4
            py-3
            rounded-2xl
            outline-none
            resize-none
            min-h-[100px]
          "
        />

      </div>

      {/* IMAGE PREVIEW */}
      {preview && (
        <div className="mt-4">

          <img
            src={preview}
            alt="preview"
            className="
              w-full
              max-h-[400px]
              object-cover
              rounded-2xl
            "
          />

        </div>
      )}

      {/* ACTIONS */}
      <div
        className="
          flex
          items-center
          justify-between
          mt-4
        "
      >

        <div className="flex items-center gap-3">

          <label
            className="
              hover:bg-slate-100
              px-3
              py-2
              rounded-lg
              cursor-pointer
              text-sm
            "
          >
            📷 Photo

            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />
          </label>

        </div>

        <button
          onClick={handleCreatePost}
          disabled={loading}
          className="
            bg-blue-900
            text-white
            px-5
            py-2
            rounded-lg
            hover:opacity-90
          "
        >
          {loading ? "Posting..." : "Post"}
        </button>

      </div>

    </div>
  );
}

export default CreatePost;