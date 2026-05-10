function EditPostModal({

  editingPost,

  editContent,
  setEditContent,

  setEditingPost,

  handleUpdatePost,

  editPreview,

  handleEditImageChange,

  handleRemoveEditImage,

}) {

  if (!editingPost) return null;

  return (

    <div className="
      fixed
      inset-0
      bg-black/50
      flex
      items-center
      justify-center
      z-50
      px-4
    ">

      <div className="
        bg-white
        rounded-3xl
        shadow-xl
        w-full
        max-w-md
        p-6
      ">

        {/* TITLE */}
        <h2 className="
          text-xl
          font-bold
          mb-5
        ">
          Edit Post
        </h2>

        {/* IMAGE PREVIEW */}
        {editPreview && (

          <div className="mb-4 relative">

            <img
              src={editPreview}
              alt="preview"
              className="
                w-full
                max-h-72
                object-cover
                rounded-2xl
              "
            />

            <button
              onClick={
                handleRemoveEditImage
              }
              className="
                absolute
                top-2
                right-2
                bg-red-500
                text-white
                text-xs
                px-3
                py-1
                rounded-full
              "
            >
              Remove
            </button>

          </div>
        )}

        {/* FILE INPUT */}
        <input
          type="file"
          accept="image/*"
          onChange={
            handleEditImageChange
          }
          className="mb-4"
        />

        {/* TEXTAREA */}
        <textarea
          value={editContent}
          onChange={(e) =>
            setEditContent(
              e.target.value
            )
          }
          rows={4}
          className="
            w-full
            border
            rounded-xl
            p-3
            outline-none
          "
        />

        {/* BUTTONS */}
        <div className="
          flex
          justify-end
          gap-3
          mt-5
        ">

          <button
            onClick={() =>
              setEditingPost(null)
            }
            className="
              px-4
              py-2
              rounded-xl
              bg-slate-200
            "
          >
            Cancel
          </button>

          <button
            onClick={handleUpdatePost}
            className="
              px-5
              py-2
              rounded-xl
              bg-blue-900
              text-white
            "
          >
            Save
          </button>

        </div>

      </div>

    </div>
  );
}

export default EditPostModal;