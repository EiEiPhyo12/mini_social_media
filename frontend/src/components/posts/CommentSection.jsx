import {
  useState,
} from "react";

import API from "../../services/api";

import CommentInput from "./CommentInput";
import CommentItem from "./CommentItem";

function CommentSection({
  post,
  currentUserId,
  isOwner,
  setCommentsCount,
}) {

  const [comments, setComments] =
    useState(post.comments || []);

  // =========================
  // CREATE COMMENT
  // =========================

  const handleComment = async (
    commentText,
    setCommentText
  ) => {

    if (!commentText.trim()) return;

    try {

      const res = await API.post(
        `/posts/${post.ID}/comments`,
        {
          content: commentText,
        }
      );

      // UPDATE COMMENTS
      setComments((prev) => [
        ...prev,
        res.data,
      ]);

      // UPDATE COUNT
      setCommentsCount(
        (prev) => prev + 1
      );

      setCommentText("");

    } catch (err) {

      console.error(err);
    }
  };

  // =========================
  // DELETE COMMENT
  // =========================

  const handleDeleteComment =
    async (commentID) => {

      try {

        await API.delete(
          `/comments/${commentID}`
        );

        setComments((prev) =>
          prev.filter(
            (comment) =>
              comment.ID !== commentID
          )
        );
        // UPDATE COUNT
        setCommentsCount(
          (prev) => prev - 1
        );
      } catch (err) {

        console.error(err);
      }
    };

  // =========================
  // EDIT COMMENT
  // =========================

  const handleEditComment =
    async (
      commentID,
      editText,
      setEditingCommentId
    ) => {

      try {

        const res = await API.put(
          `/comments/${commentID}`,
          {
            content: editText,
          }
        );

        setComments((prev) =>
          prev.map((comment) =>
            comment.ID === commentID
              ? {
                ...comment,
                content: res.data.content,
              }
              : comment
          )
        );

        setEditingCommentId(null);

      } catch (err) {

        console.error(err);
      }
    };

  return (

    <div className="border-t p-4 space-y-4">

      <CommentInput
        onSubmit={handleComment}
      />

      <div className="space-y-3">

        {comments?.map((comment) => (

          <CommentItem
            key={comment.ID}
            comment={comment}
            currentUserId={currentUserId}
            isOwner={isOwner}
            onDelete={handleDeleteComment}
            onEdit={handleEditComment}
          />

        ))}

      </div>

    </div>
  );
}

export default CommentSection;