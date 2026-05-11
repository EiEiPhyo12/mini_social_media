import {
  Heart,
  MessageCircle,
  MoreHorizontal,
  Image as ImageIcon,
} from "lucide-react";

import { useEffect, useState } from "react";

import API from "../services/api";
import Navbar from "../components/Navbar";

function MyPostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // CURRENT USER
  // =========================
  const token = localStorage.getItem("token");

  let currentUserId = null;

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      currentUserId = Number(payload.userId);
    } catch (err) {
      console.error(err);
    }
  }

  // =========================
  // FETCH POSTS
  // =========================
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await API.get("/myposts");
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // =========================
  // LIKE / UNLIKE (FIXED)
  // =========================
  const handleToggleLike = async (postId) => {
    try {
      await API.post(`/posts/${postId}/like`);

      // 🔥 IMPORTANT: always refetch from server
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  // =========================
  // COMMENT
  // =========================
  const handleComment = async (postId, commentText, setCommentText) => {
    if (!commentText.trim()) return;

    try {
      const res = await API.post(`/posts/${postId}/comments`, {
        content: commentText,
      });

      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post.ID !== postId) return post;

          return {
            ...post,
            comments: [...(post.comments || []), res.data],
          };
        })
      );

      setCommentText("");
    } catch (err) {
      console.error(err);
    }
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-slate-600 text-lg">Loading posts...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      {/* HERO */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 pt-28 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-white">My Posts</h1>
          <p className="text-slate-300 mt-2">
            Share your thoughts, moments and ideas.
          </p>
        </div>
      </div>

      {/* POSTS */}
      <div className="max-w-4xl mx-auto px-4 -mt-10 pb-16 space-y-8">
        {posts.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center shadow-sm border">
            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto">
              <ImageIcon size={34} className="text-slate-500" />
            </div>

            <h2 className="mt-5 text-2xl font-bold text-slate-800">
              No Posts Yet
            </h2>

            <p className="text-slate-500 mt-2">
              Start sharing your first post.
            </p>
          </div>
        ) : (
          posts.map((post) => {
            const liked = post.likes?.some(
              (like) =>
                Number(like.user_id) === Number(currentUserId)
            );

            const likesCount = post.likes?.length || 0;
            const commentsCount = post.comments?.length || 0;

            return (
              <div
                key={post.ID}
                className="bg-white rounded-3xl overflow-hidden border shadow-sm hover:shadow-lg transition"
              >
                {/* HEADER */}
                <div className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {post.user?.avatar ? (
                      <img
                        src={post.user.avatar}
                        alt="avatar"
                        className="w-12 h-12 rounded-full object-cover border"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold">
                        {post.user?.username?.charAt(0).toUpperCase()}
                      </div>
                    )}

                    <div>
                      <h3 className="font-semibold text-slate-800">
                        {post.user?.username}
                      </h3>

                      <p className="text-xs text-slate-500">
                        {new Date(post.CreatedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <button className="p-2 rounded-full hover:bg-slate-100">
                    <MoreHorizontal size={18} />
                  </button>
                </div>

                {/* CONTENT */}
                <div className="px-5 pb-4">
                  <p className="text-slate-700 leading-relaxed">
                    {post.content}
                  </p>
                </div>

                {/* IMAGE */}
                {post.image && (
                  <div className="bg-black">
                    <img
                      src={post.image}
                      alt="post"
                      className="w-full max-h-[500px] object-cover"
                    />
                  </div>
                )}

                {/* COUNTS */}
                <div className="px-5 pt-4 flex justify-between text-sm text-slate-500">
                  <span>❤️ {likesCount} Likes</span>
                  <span>💬 {commentsCount} Comments</span>
                </div>

                {/* ACTIONS */}
                <div className="px-3 py-3 flex items-center gap-2 border-t mt-4">
                  <button
                    onClick={() => handleToggleLike(post.ID)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl hover:bg-slate-100"
                  >
                    <Heart
                      size={20}
                      className={
                        liked ? "fill-red-500 text-red-500" : ""
                      }
                    />
                    Like
                  </button>

                  <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl hover:bg-slate-100">
                    <MessageCircle size={20} />
                    Comment
                  </button>
                </div>

                {/* COMMENTS */}
                <CommentBox
                  post={post}
                  handleComment={handleComment}
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// =========================
// COMMENT BOX
// =========================
function CommentBox({ post, handleComment }) {
  const [commentText, setCommentText] = useState("");

  return (
    <div className="px-5 pb-5">
      <div className="flex gap-3 mt-2">
        <input
          type="text"
          placeholder="Write a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="flex-1 border rounded-2xl px-4 py-3 outline-none focus:border-blue-500"
        />

        <button
          onClick={() =>
            handleComment(post.ID, commentText, setCommentText)
          }
          className="bg-blue-900 text-white px-5 rounded-2xl"
        >
          Post
        </button>
      </div>

      <div className="space-y-4 mt-5">
        {post.comments?.map((comment) => (
          <div key={comment.ID} className="flex gap-3">
            {comment.user?.avatar ? (
              <img
                src={comment.user.avatar}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-slate-300 flex items-center justify-center">
                {comment.user?.username?.charAt(0)}
              </div>
            )}

            <div className="bg-slate-100 rounded-2xl px-4 py-3 flex-1">
              <h4 className="font-semibold text-sm">
                {comment.user?.username}
              </h4>
              <p className="text-sm">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyPostsPage;