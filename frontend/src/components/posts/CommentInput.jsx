import {
  useState,
} from "react";

function CommentInput({
  onSubmit,
}) {

  const [commentText, setCommentText] =
    useState("");

  return (

    <div className="flex gap-2">

      <input
        type="text"
        placeholder="Write a comment..."
        value={commentText}
        onChange={(e) =>
          setCommentText(
            e.target.value
          )
        }
        className="
          flex-1
          border
          rounded-xl
          px-4
          py-2
          outline-none
        "
      />

      <button
        onClick={() =>
          onSubmit(
            commentText,
            setCommentText
          )
        }
        className="
          bg-blue-900
          text-white
          px-4
          rounded-xl
        "
      >
        Post
      </button>

    </div>
  );
}

export default CommentInput;