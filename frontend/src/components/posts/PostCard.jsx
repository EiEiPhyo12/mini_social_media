import {
  MoreHorizontal,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import PostActions from "./PostActions";
import CommentSection from "./CommentSection";

function PostCard({
  post,
  currentUserId,
  openEditPost = () => { },
  handleDeletePost = () => { },
}) {

  const [menuOpen, setMenuOpen] =
    useState(false);

  const [showComments, setShowComments] =
    useState(false);

  const [commentsCount, setCommentsCount] =
    useState(
      post.comments_count ||
      post.comments?.length ||
      0
    );

  const menuRef = useRef(null);

  const isOwner =
    post.user_id === currentUserId;

  // =========================
  // CLOSE MENU
  // =========================

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

              {post.user?.username
                ?.charAt(0)
                .toUpperCase() || "U"}

            </div>
          )}

          <div>

            <h4 className="font-semibold text-slate-800 text-sm">
              {post.user?.username}
            </h4>

            <p className="text-xs text-slate-500">
              {new Date(
                post.CreatedAt
              ).toLocaleString()}
            </p>

          </div>

        </div>

        {/* MENU */}
        {isOwner && (

          <div
            ref={menuRef}
            className="relative"
          >

            <button
              onClick={() =>
                setMenuOpen(!menuOpen)
              }
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

                    handleDeletePost(
                      post.ID
                    );

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
      <PostActions
        post={post}
        currentUserId={currentUserId}
        showComments={showComments}
        setShowComments={setShowComments}
        commentsCount={commentsCount}
      />

      {/* COMMENTS */}
      {showComments && (

        <CommentSection
          post={post}
          currentUserId={currentUserId}
          isOwner={isOwner}
          setCommentsCount={setCommentsCount}
        />

      )}

    </div>
  );
}

export default PostCard;