import {
  MoreHorizontal,
  Heart,
  MessageCircle,
  Edit2,
  Trash2,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import API from "../../services/api";

function PostCard({
  post,
  currentUserId,
  handleDeletePost,
  openEditPost,
}) {

  const [menuOpen, setMenuOpen] =
    useState(false);

  const [liked, setLiked] =
    useState(false);

  const [likesCount, setLikesCount] =
    useState(post.likes?.length || 0);

  const [showComments, setShowComments] =
    useState(false);

  const [commentText, setCommentText] =
    useState("");
  const [comments, setComments] = useState(post.comments || []);
  const [commentsCount, setCommentsCount] = useState(post.comments_count || post.comments?.length || 0);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const menuRef = useRef(null);


  useEffect(() => {
    const likes = post.likes || [];

    const hasLiked = likes.some(
      (like) =>
        String(like.user_id) ===
        String(currentUserId)
    );
    console.log("current user:", currentUserId);
    console.log("liked user:", likes.map(l => l.user_id));


    console.log(hasLiked);


    setLiked(hasLiked);
    setLikesCount(likes.length);
  }, [post.likes, currentUserId]);

  // =====================
  // CLOSE MENU
  // =====================

  useEffect(() => {

    const handleClickOutside = (
      event
    ) => {

      if (
        menuRef.current &&
        !menuRef.current.contains(
          event.target
        )
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };

  }, []);

  // =====================
  // LIKE ACTION
  // =====================

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

  const handleComment = async () => {
    if (!commentText.trim()) return;

    try {
      const res = await API.post(
        `/posts/${post.ID}/comments`,
        { content: commentText }
      );

      // IMPORTANT: update state properly
      setComments((prev) => [...prev, res.data]);

      setCommentText("");
      // UPDATE COUNT
      setCommentsCount(
        (prev) => prev + 1
      );

    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteComment = async (commentId) => {

    try {

      await API.delete(`/comments/${commentId}`);

      setComments((prev) =>
        prev.filter((c) => c.ID !== commentId)
      );

      setCommentsCount((prev) => prev - 1);

    } catch (err) {
      console.error(err);
    }
  };

  const handleEditComment = async (commentId) => {

    try {

      await API.put(`/comments/${commentId}`, {
        content: editingText,
      });

      setComments((prev) =>
        prev.map((c) =>
          c.ID === commentId
            ? { ...c, content: editingText }
            : c
        )
      );

      setEditingCommentId(null);
      setEditingText("");

    } catch (err) {
      console.error(err);
    }
  };
  return (

    <div className="bg-white rounded-2xl shadow border overflow-hidden">

      {/* IMAGE */}
      {post.image && (
        <img
          src={post.image}
          alt="post"
          className="w-full h-60 object-cover"
        />
      )}

      {/* BODY */}
      <div className="p-4">

        {/* TOP */}
        <div className="flex justify-between items-start">

          <div className="flex-1">

            <p className="text-sm text-slate-700 leading-relaxed">
              {post.content}
            </p>

            <p className="text-xs text-slate-400 mt-3">
              {new Date(
                post.CreatedAt
              ).toLocaleString()}
            </p>

          </div>

          {/* MENU */}
          <div
            ref={menuRef}
            className="relative ml-2"
          >

            <button
              onClick={() =>
                setMenuOpen(!menuOpen)
              }
              className="
                p-2
                rounded-full
                hover:bg-slate-100
              "
            >
              <MoreHorizontal size={18} />
            </button>

            {/* DROPDOWN */}
            {menuOpen && (
              <div
                className="
                  absolute
                  right-0
                  top-10
                  w-40
                  bg-white
                  rounded-xl
                  shadow-xl
                  border
                  z-50
                  overflow-hidden
                "
              >

                <button
                  onClick={() => {

                    openEditPost(post);

                    setMenuOpen(false);
                  }}
                  className="
                    w-full
                    flex
                    items-center
                    gap-2
                    px-4
                    py-3
                    text-sm
                    hover:bg-slate-100
                  "
                >
                  <Edit2 size={16} />
                  Edit
                </button>

                <button
                  onClick={() => {

                    handleDeletePost(
                      post.ID
                    );

                    setMenuOpen(false);
                  }}
                  className="
                    w-full
                    flex
                    items-center
                    gap-2
                    px-4
                    py-3
                    text-sm
                    text-red-500
                    hover:bg-slate-100
                  "
                >
                  <Trash2 size={16} />
                  Delete
                </button>

              </div>
            )}

          </div>

        </div>

        {/* LIKE / COMMENT COUNTS */}
        <div className="
          flex
          items-center
          justify-between
          mt-4
          text-sm
          text-slate-500
        ">

          <span>
            {likesCount} Likes
          </span>

          <span>
            {commentsCount || 0}
            {" "}
            Comments
          </span>

        </div>

        {/* ACTIONS */}
        <div className="
          flex
          justify-between
          border-t
          mt-3
          pt-2
        ">

          {/* LIKE */}
          <button
            onClick={handleLike}
            className="
              flex-1
              flex
              items-center
              justify-center
              gap-2
              py-2
              rounded-lg
              hover:bg-slate-100
              transition
            "
          >
            <Heart
              size={18}
              className={
                liked
                  ? "fill-red-500 text-red-500"
                  : ""
              }
            />

            <span>
              Like
            </span>

          </button>

          {/* COMMENT */}
          <button
            onClick={() =>
              setShowComments(!showComments)}
            className="
              flex-1
              flex
              items-center
              justify-center
              gap-2
              py-2
              rounded-lg
              hover:bg-slate-100
            "
          >

            <MessageCircle size={18} />

            <span>
              Comment
            </span>

          </button>

        </div>

        {showComments && (

          <div className="border-t p-4 space-y-4">

            {/* CREATE COMMENT */}

            <div className="flex gap-2">

              <input
                type="text"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) =>
                  setCommentText(e.target.value)
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
                onClick={handleComment}
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

            {/* COMMENTS */}

            <div className="space-y-3">

              {comments?.map((comment) => {

                const isOwner =
                  comment.user_id === currentUserId;

                const isEditing =
                  editingCommentId === comment.ID;

                return (

                  <div
                    key={comment.ID}
                    className="flex gap-3 group"
                  >

                    {/* AVATAR */}
                    {comment.user?.avatar ? (
                      <img
                        src={comment.user.avatar}
                        className="w-9 h-9 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-slate-300 flex items-center justify-center text-sm font-semibold">
                        {comment.user?.username?.charAt(0).toUpperCase() || "U"}
                      </div>
                    )}

                    {/* COMMENT BOX */}
                    <div className="bg-slate-100 rounded-2xl px-4 py-2 flex-1 relative">

                      {/* USERNAME */}
                      <p className="font-semibold text-sm">
                        {comment.user?.username}
                      </p>

                      {/* EDIT MODE */}
                      {isEditing ? (

                        <div className="flex gap-2 mt-1">

                          <input
                            value={editingText}
                            onChange={(e) =>
                              setEditingText(e.target.value)
                            }
                            className="w-full px-2 py-1 text-sm rounded-lg border"
                          />

                          <button
                            onClick={() =>
                              handleEditComment(comment.ID)
                            }
                            className="text-blue-600 text-xs"
                          >
                            Save
                          </button>

                          <button
                            onClick={() =>
                              setEditingCommentId(null)
                            }
                            className="text-gray-500 text-xs"
                          >
                            Cancel
                          </button>

                        </div>

                      ) : (

                        <p className="text-sm text-slate-700">
                          {comment.content}
                        </p>
                      )}

                      {/* ACTIONS (show on hover) */}
                      {isOwner && !isEditing && (

                        <div className="absolute right-2 top-1 opacity-0 group-hover:opacity-100 transition flex gap-2">

                          {/* EDIT */}
                          <button
                            onClick={() => {
                              setEditingCommentId(comment.ID);
                              setEditingText(comment.content);
                            }}
                            className="text-xs text-blue-600"
                          >
                            Edit
                          </button>

                          {/* DELETE */}
                          <button
                            onClick={() =>
                              handleDeleteComment(comment.ID)
                            }
                            className="text-xs text-red-500"
                          >
                            Delete
                          </button>

                        </div>
                      )}

                    </div>

                  </div>

                );
              })}

            </div>
          </div>
        )}
      </div>

    </div>
  );
}

export default PostCard;