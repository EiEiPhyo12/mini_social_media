import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";

function PostActions({
  post,
  currentUserId,
  openEditPost,
  handleDeletePost,
}) {

  const [open, setOpen] = useState(false);

  const menuRef = useRef(null);

  // =========================
  // CLOSE ON OUTSIDE CLICK
  // =========================

  useEffect(() => {

    const handleClickOutside = (e) => {

      if (
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setOpen(false);
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

  // =========================
  // CHECK OWNER
  // =========================

  const isOwner = post.user_id === currentUserId;

  return (

    <div className="border-t mt-4 pt-2">

      {/* =========================
          LIKE / COMMENT / SHARE
      ========================= */}
      <div className="
        flex
        items-center
        justify-between
      ">

        <button className="
          flex
          items-center
          gap-2
          flex-1
          justify-center
          py-2
          rounded-lg
          hover:bg-slate-100
          text-slate-600
        ">
          <Heart size={18} />
          <span className="text-sm">Like</span>
        </button>

        <button className="
          flex
          items-center
          gap-2
          flex-1
          justify-center
          py-2
          rounded-lg
          hover:bg-slate-100
          text-slate-600
        ">
          <MessageCircle size={18} />
          <span className="text-sm">Comment</span>
        </button>

        <button className="
          flex
          items-center
          gap-2
          flex-1
          justify-center
          py-2
          rounded-lg
          hover:bg-slate-100
          text-slate-600
        ">
          <Share2 size={18} />
          <span className="text-sm">Share</span>
        </button>

      </div>

      {/* =========================
          OWNER 3-DOT MENU
      ========================= */}

      {isOwner && (

        <div className="relative flex justify-end mt-2" ref={menuRef}>

          {/* 3 DOT BUTTON */}
          <button
            onClick={() => setOpen(!open)}
            className="
              p-2
              rounded-full
              hover:bg-slate-100
            "
          >
            <MoreHorizontal size={18} />
          </button>

          {/* DROPDOWN */}
          {open && (

            <div className="
              absolute
              right-0
              top-8
              w-36
              bg-white
              border
              rounded-xl
              shadow-lg
              z-50
              overflow-hidden
            ">

              <button
                onClick={() => {
                  openEditPost(post);
                  setOpen(false);
                }}
                className="
                  flex
                  items-center
                  gap-2
                  w-full
                  px-3
                  py-2
                  text-sm
                  hover:bg-slate-100
                "
              >
                <Pencil size={16} />
                Edit
              </button>

              <button
                onClick={() => {
                  handleDeletePost(post.ID);
                  setOpen(false);
                }}
                className="
                  flex
                  items-center
                  gap-2
                  w-full
                  px-3
                  py-2
                  text-sm
                  text-red-600
                  hover:bg-slate-100
                "
              >
                <Trash2 size={16} />
                Delete
              </button>

            </div>
          )}

        </div>
      )}

    </div>
  );
}

export default PostActions;