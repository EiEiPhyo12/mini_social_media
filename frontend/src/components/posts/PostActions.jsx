import {
  Heart,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import API from "../../services/api";

function PostActions({
  post,
  currentUserId,
  showComments,
  setShowComments,
  commentsCount,
}) {

  const [liked, setLiked] =
    useState(false);

  const [likesCount, setLikesCount] =
    useState(post.likes?.length || 0);

  // =========================
  // CHECK LIKE
  // =========================

  useEffect(() => {

    if (!post.likes) return;

    const hasLiked =
      post.likes.some(
        (like) =>
          like.user_id === currentUserId
      );

    setLiked(hasLiked);

  }, [post.likes, currentUserId]);

  // =========================
  // HANDLE LIKE
  // =========================

  const handleLike = async () => {

    try {

      await API.post(
        `/posts/${post.ID}/like`
      );

      if (liked) {

        setLiked(false);

        setLikesCount(
          (prev) => prev - 1
        );

      } else {

        setLiked(true);

        setLikesCount(
          (prev) => prev + 1
        );
      }

    } catch (err) {

      console.error(err);
    }
  };

  return (

    <div className="flex justify-between border-t px-4 py-2 text-slate-600">

      {/* LIKE */}
      <button
        onClick={handleLike}
        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-slate-100"
      >

        <Heart
          size={18}
          className={
            liked
              ? "fill-red-500 text-red-500"
              : ""
          }
        />

        Like

        {likesCount > 0 && (

          <span className="text-xs">
            ({likesCount})
          </span>
        )}

      </button>

      {/* COMMENT */}
      <button
        onClick={() =>
          setShowComments(
            !showComments
          )
        }
        className="flex-1 hover:bg-slate-100 py-2 rounded-lg"
      >

        💬 Comment

        {commentsCount > 0 && (

          <span className="text-xs text-slate-500 ml-1">
            ({commentsCount})
          </span>
        )}

      </button>

      {/* SHARE */}
      <button className="flex-1 hover:bg-slate-100 py-2 rounded-lg">
        🔁 Share
      </button>

    </div>
  );
}

export default PostActions;