function CreatePostBox({
  newContent,
  setNewContent,
  setNewImage,
  handleCreatePost,
  fileInputRef,
}) {

  return (

    <div className="bg-white rounded-3xl shadow p-5 mt-8">

      <textarea
        value={newContent}
        onChange={(e) =>
          setNewContent(e.target.value)
        }
        placeholder="What's on your mind?"
        rows={3}
        className="w-full border rounded-xl p-3 outline-none"
      />

      <input
        ref={fileInputRef}
        type="file"
        onChange={(e) =>
          setNewImage(e.target.files[0])
        }
        className="mt-4"
      />

      <button
        onClick={handleCreatePost}
        disabled={!newContent}
        className="mt-4 bg-blue-900 text-white px-5 py-2 rounded-xl hover:opacity-90 disabled:opacity-50"
      >
        Create Post
      </button>

    </div>
  );
}

export default CreatePostBox;