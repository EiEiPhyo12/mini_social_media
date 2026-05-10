import {
  MoreHorizontal,
  Heart,
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
  openEditPost,
  handleDeletePost,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const [liked, setLiked] = useState(false);

  const [likesCount, setLikesCount] =
    useState(post.likes?.length || 0);

  const [showComments, setShowComments] =
    useState(false);

  const [commentText, setCommentText] =
    useState("");

  // ✅ FIX: use state instead of mutating props
  const [comments, setComments] = useState(post.comments || []);

  const isOwner = post.user_id === currentUserId;

  // =====================
  // CHECK LIKE STATUS
  // =====================
  useEffect(() => {
    if (!post.likes) return;

    const hasLiked = post.likes.some(
      (like) => like.user_id === currentUserId
    );

    setLiked(hasLiked);
  }, [post.likes, currentUserId]);

  // =====================
  // CLOSE MENU OUTSIDE CLICK
  // =====================
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // =====================
  // LIKE POST
  // =====================
  const handleLike = async () => {
    try {
      await API.post(`/posts/${post.ID}/like`);

      if (liked) {
        setLiked(false);
        setLikesCount((prev) => prev - 1);
      } else {
        setLiked(true);
        setLikesCount((prev) => prev + 1);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // =====================
  // ADD COMMENT (FIXED)
  // =====================
  const handleComment = async () => {
    if (!commentText.trim()) return;

    try {
      const res = await API.post(
        `/posts/${post.ID}/comments`,
        { content: commentText }
      );

      // ✅ FIX: update state properly (NOT post.comments.push)
      setComments((prev) => [...prev, res.data]);

      setCommentText("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">

      {/* HEADER */}
      <div className="flex items-center justify-between p-4 relative">

        <div className="flex items-center gap-3">

          {post.user?.avatar ? (
            <img
              src={post.user.avatar}
              alt="avatar"
              className="w-11 h-11 rounded-full object-cover"
            />
          ) : (
            <div className="w-11 h-11 rounded-full bg-blue-900 text-white flex items-center justify-center font-semibold">
              {post.user?.username?.charAt(0).toUpperCase() || "U"}
            </div>
          )}

          <div>
            <h4 className="font-semibold text-slate-800 text-sm">
              {post.user?.username}
            </h4>

            <p className="text-xs text-slate-500">
              {new Date(post.CreatedAt).toLocaleString()}
            </p>
          </div>
        </div>

        {/* MENU */}
        {isOwner && (
          <div ref={menuRef} className="relative">

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-full hover:bg-slate-100"
            >
              <MoreHorizontal size={18} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-white border rounded-xl shadow-lg z-50">

                <button
                  onClick={() => {
                    openEditPost(post);
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100"
                >
                  ✏️ Edit
                </button>

                <button
                  onClick={() => {
                    handleDeletePost(post.ID);
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-slate-100"
                >
                  🗑️ Delete
                </button>

              </div>
            )}
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="px-4 pb-4">
        <p className="text-slate-700 text-sm">
          {post.content}
        </p>
      </div>

      {/* IMAGE */}
      {post.image && (
        <div className="w-full max-h-[450px] overflow-hidden bg-black flex items-center justify-center">
          <img
            src={post.image}
            alt="post"
            className="w-full h-full object-contain"
          />
        </div>
      )}

      {/* ACTIONS */}
      <div className="flex justify-between border-t px-4 py-2 text-slate-600">

        {/* LIKE */}
        <button
          onClick={handleLike}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-slate-100"
        >
          <Heart
            size={18}
            className={liked ? "fill-red-500 text-red-500" : ""}
          />

          Like

          {likesCount > 0 && (
            <span className="text-xs">({likesCount})</span>
          )}
        </button>

        {/* COMMENT */}
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex-1 hover:bg-slate-100 py-2 rounded-lg"
        >
          💬 Comment
        </button>

        {/* SHARE */}
        <button className="flex-1 hover:bg-slate-100 py-2 rounded-lg">
          🔁 Share
        </button>

      </div>

      {/* COMMENTS */}
      {showComments && (
        <div className="border-t p-4 space-y-4">

          {/* INPUT */}
          <div className="flex gap-2">

            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 border rounded-xl px-4 py-2 outline-none"
            />

            <button
              onClick={handleComment}
              className="bg-blue-900 text-white px-4 rounded-xl"
            >
              Post
            </button>

          </div>

          {/* LIST */}
          <div className="space-y-3">

            {comments?.map((comment) => (
              <div key={comment.ID} className="flex gap-3">

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

                <div className="bg-slate-100 rounded-2xl px-4 py-2 flex-1">
                  <p className="font-semibold text-sm">
                    {comment.user?.username}
                  </p>
                  <p className="text-sm text-slate-700">
                    {comment.content}
                  </p>
                </div>

              </div>
            ))}

          </div>
        </div>
      )}
    </div>
  );
}

export default PostCard;