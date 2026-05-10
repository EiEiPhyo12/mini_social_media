import {
  useState,
} from "react";

function CommentItem({
  comment,
  currentUserId,
  isOwner,
  onDelete,
  onEdit,
}) {

  const [editingCommentId, setEditingCommentId] =
    useState(null);

  const [editCommentText, setEditCommentText] =
    useState("");

  return (

    <div className="flex gap-3">

      {/* AVATAR */}
      {comment.user?.avatar ? (

        <img
          src={comment.user.avatar}
          alt="avatar"
          className="
            w-9
            h-9
            rounded-full
            object-cover
          "
        />

      ) : (

        <div
          className="
            w-9
            h-9
            rounded-full
            bg-slate-300
            flex
            items-center
            justify-center
            text-sm
            font-semibold
          "
        >
          {comment.user?.username
            ?.charAt(0)
            .toUpperCase() || "U"}
        </div>
      )}

      {/* BODY */}
      <div className="
        bg-slate-100
        rounded-2xl
        px-4
        py-2
        flex-1
      ">

        {/* TOP */}
        <div className="flex justify-between items-center">

          <p className="font-semibold text-sm">
            {comment.user?.username}
          </p>

          {(comment.user_id === currentUserId ||
            isOwner) && (

              <div className="flex items-center gap-2">

                {comment.user_id === currentUserId && (

                  <button
                    onClick={() => {
                      setEditingCommentId(comment.ID);
                      setEditCommentText(comment.content);
                    }}
                    className="text-blue-500 text-xs"
                  >
                    Edit
                  </button>

                )}

                <button
                  onClick={() =>
                    onDelete(comment.ID)
                  }
                  className="text-red-500 text-xs"
                >
                  Delete
                </button>

              </div>
            )}

        </div>

        {/* EDIT MODE */}
        {editingCommentId === comment.ID ? (

          <div className="mt-2 space-y-2">

            <input
              type="text"
              value={editCommentText}
              onChange={(e) =>
                setEditCommentText(
                  e.target.value
                )
              }
              className="
                w-full
                border
                rounded-lg
                px-3
                py-2
                text-sm
                outline-none
              "
            />

            <div className="flex gap-2">

              <button
                onClick={() =>
                  onEdit(
                    comment.ID,
                    editCommentText,
                    setEditingCommentId
                  )
                }
                className="
                  bg-blue-900
                  text-white
                  px-3
                  py-1
                  rounded-lg
                  text-sm
                "
              >
                Save
              </button>

              <button
                onClick={() =>
                  setEditingCommentId(null)
                }
                className="
                  bg-slate-300
                  px-3
                  py-1
                  rounded-lg
                  text-sm
                "
              >
                Cancel
              </button>

            </div>

          </div>

        ) : (

          <p className="text-sm text-slate-700 mt-1">
            {comment.content}
          </p>

        )}

      </div>

    </div>
  );
}

export default CommentItem;