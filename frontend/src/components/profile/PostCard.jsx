import { useEffect, useRef, useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { Edit2, Trash2 } from "lucide-react";
function PostCard({
  post,
  handleDeletePost,
  openEditPost,
}) {

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // =====================
  // CLOSE ON OUTSIDE CLICK
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

  return (

    <div className="bg-white rounded-2xl shadow flex flex-col relative overflow-visible">

      {/* IMAGE */}
      {post.image && (
        <img
          src={post.image}
          alt="post"
          className="w-full h-60 object-cover"
        />
      )}

      {/* BODY */}
      <div className="p-4 flex flex-col flex-1">

        {/* TOP */}
        <div className="flex justify-between items-start">

          <p className="text-sm text-slate-700 leading-relaxed flex-1">
            {post.content}
          </p>

          {/* MENU */}
          <div ref={menuRef} className="relative">

            {/* 3 DOT BUTTON */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="
                p-2
                rounded-full
                hover:bg-slate-100
                transition
              "
            >
              <MoreHorizontal size={18} />
            </button>

            {/* DROPDOWN */}
            {menuOpen && (
              <div className="
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
                animate-fadeIn
              ">

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
    py-2
    text-sm
    hover:bg-slate-100
    transition
  "
                >
                  <Edit2 size={16} />
                  Edit
                </button>

                <button
                  onClick={() => {
                    handleDeletePost(post.ID);
                    setMenuOpen(false);
                  }}
                  className="
    w-full
    flex
    items-center
    gap-2
    px-4
    py-2
    text-sm
    text-red-500
    hover:bg-slate-100
    transition
  "
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            )}

          </div>

        </div>

        {/* DATE */}
        <p className="text-xs text-slate-400 mt-4">
          {new Date(post.CreatedAt).toLocaleString()}
        </p>

      </div>

    </div>
  );
}

export default PostCard;