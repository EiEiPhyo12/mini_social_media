import { useEffect, useState } from "react";

import {
  Heart,
  MessageCircle,
  // MoreHorizontal,
  // Edit2,
  Trash2,
} from "lucide-react";

import { useParams } from "react-router-dom";

import API from "../services/api";

import Navbar from "../components/Navbar";

function OtherProfilePage() {

  const { id } = useParams();

  const [user, setUser] = useState(null);

  const [posts, setPosts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [showComments, setShowComments] =
    useState({});

  const [commentText, setCommentText] =
    useState({});

  const token = localStorage.getItem("token");

  let currentUserId = null;

  if (token) {
    try {

      const payload = JSON.parse(
        atob(token.split(".")[1])
      );

      currentUserId =
        payload.user_id;

    } catch (err) {
      console.error(err);
    }
  }

  // =========================
  // FETCH PROFILE + POSTS
  // =========================

  useEffect(() => {

    const fetchData = async () => {

      try {

        setLoading(true);

        const userRes =
          await API.get(
            `/users/${id}`
          );

        setUser(userRes.data);

        const postsRes =
          await API.get(
            `/users/${id}/posts`
          );
        console.log("postsRes:", postsRes);
        setPosts(postsRes.data);

      } catch (err) {

        console.error(err);

      } finally {

        setLoading(false);
      }
    };

    fetchData();

  }, [id]);

  // =========================
  // LIKE
  // =========================

  const handleLike = async (
    postId
  ) => {

    try {

      await API.post(
        `/posts/${postId}/like`
      );

      setPosts((prev) =>
        prev.map((post) => {

          if (post.ID !== postId)
            return post;

          const alreadyLiked =
            post.likes?.some(
              (like) =>
                String(
                  like.user_id
                ) ===
                String(
                  currentUserId
                )
            );

          if (alreadyLiked) {

            return {
              ...post,
              likes:
                post.likes.filter(
                  (like) =>
                    String(
                      like.user_id
                    ) !==
                    String(
                      currentUserId
                    )
                ),
            };
          }

          return {
            ...post,
            likes: [
              ...(post.likes || []),
              {
                user_id:
                  currentUserId,
              },
            ],
          };
        })
      );

    } catch (err) {

      console.error(err);
    }
  };

  // =========================
  // COMMENT
  // =========================

  const handleComment = async (
    postId
  ) => {

    if (
      !commentText[postId]?.trim()
    )
      return;

    try {

      const res =
        await API.post(
          `/posts/${postId}/comments`,
          {
            content:
              commentText[
              postId
              ],
          }
        );

      setPosts((prev) =>
        prev.map((post) => {

          if (post.ID !== postId)
            return post;

          return {
            ...post,
            comments: [
              ...(post.comments ||
                []),
              res.data,
            ],
          };
        })
      );

      setCommentText((prev) => ({
        ...prev,
        [postId]: "",
      }));

    } catch (err) {

      console.error(err);
    }
  };

  // =========================
  // DELETE POST
  // =========================

  const handleDeletePost =
    async (postId) => {

      try {

        await API.delete(
          `/posts/${postId}`
        );

        setPosts((prev) =>
          prev.filter(
            (post) =>
              post.ID !== postId
          )
        );

      } catch (err) {

        console.error(err);
      }
    };

  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Loading...
      </div>
    );
  }

  return (

    <div className="min-h-screen bg-slate-100">

      <Navbar />

      <div className="max-w-3xl mx-auto pt-24 pb-10 px-4">

        {/* PROFILE HEADER */}

        <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">

          {/* COVER */}
          <div className="h-40 bg-gradient-to-r from-blue-900 via-indigo-800 to-slate-900" />

          <div className="px-6 pb-6">

            {/* AVATAR */}
            <div className="-mt-14">

              {user?.avatar ? (

                <img
                  src={user.avatar}
                  alt="avatar"
                  className="w-28 h-28 rounded-full border-4 border-white object-cover shadow-lg"
                />

              ) : (

                <div className="w-28 h-28 rounded-full bg-blue-900 border-4 border-white text-white flex items-center justify-center text-4xl font-bold shadow-lg">

                  {user?.username
                    ?.charAt(0)
                    .toUpperCase()}

                </div>
              )}

            </div>

            {/* USER INFO */}
            <div className="mt-4">

              <h1 className="text-2xl font-bold text-slate-800">
                {user?.username}
              </h1>

              <p className="text-slate-500 text-sm mt-1">
                {user?.email}
              </p>

              {user?.bio && (
                <p className="mt-3 text-slate-700">
                  {user.bio}
                </p>
              )}

            </div>

            {/* STATS */}
            <div className="flex gap-8 mt-5">

              <div>
                <p className="font-bold text-lg">
                  {posts.length}
                </p>
                <p className="text-slate-500 text-sm">
                  Posts
                </p>
              </div>

              <div>
                <p className="font-bold text-lg">
                  {
                    posts.reduce(
                      (
                        total,
                        post
                      ) =>
                        total +
                        (
                          post
                            .likes
                            ?.length ||
                          0
                        ),
                      0
                    )
                  }
                </p>
                <p className="text-slate-500 text-sm">
                  Likes
                </p>
              </div>

            </div>

          </div>

        </div>

        {/* POSTS */}

        <div className="space-y-6 mt-8">

          {posts.map((post) => {

            const liked =
              post.likes?.some(
                (like) =>
                  String(
                    like.user_id
                  ) ===
                  String(
                    currentUserId
                  )
              );

            return (

              <div
                key={post.ID}
                className="bg-white rounded-3xl shadow-sm border overflow-hidden"
              >

                {/* POST HEADER */}
                <div className="flex items-center justify-between p-4">

                  <div className="flex items-center gap-3">

                    {user?.avatar ? (

                      <img
                        src={
                          user.avatar
                        }
                        className="w-11 h-11 rounded-full object-cover"
                      />

                    ) : (

                      <div className="w-11 h-11 rounded-full bg-blue-900 text-white flex items-center justify-center font-semibold">

                        {user?.username
                          ?.charAt(
                            0
                          )
                          .toUpperCase()}

                      </div>
                    )}

                    <div>

                      <h3 className="font-semibold text-slate-800">
                        {
                          user?.username
                        }
                      </h3>

                      <p className="text-xs text-slate-500">
                        {new Date(
                          post.CreatedAt
                        ).toLocaleString()}
                      </p>

                    </div>

                  </div>

                  {/* OWNER MENU */}
                  {String(
                    post.user_id
                  ) ===
                    String(
                      currentUserId
                    ) && (

                      <button
                        onClick={() =>
                          handleDeletePost(
                            post.ID
                          )
                        }
                        className="p-2 rounded-full hover:bg-slate-100"
                      >
                        <Trash2
                          size={
                            18
                          }
                          className="text-red-500"
                        />
                      </button>
                    )}

                </div>

                {/* CONTENT */}
                <div className="px-4 pb-4">

                  <p className="text-slate-700 leading-relaxed">
                    {post.content}
                  </p>

                </div>

                {/* IMAGE */}
                {post.image && (

                  <img
                    src={
                      post.image
                    }
                    alt="post"
                    className="w-full max-h-[500px] object-cover"
                  />

                )}

                {/* STATS */}
                <div className="flex justify-between px-4 py-3 text-sm text-slate-500 border-b">

                  <span>
                    {
                      post.likes
                        ?.length ||
                      0
                    }{" "}
                    Likes
                  </span>

                  <span>
                    {
                      post
                        .comments
                        ?.length ||
                      0
                    }{" "}
                    Comments
                  </span>

                </div>

                {/* ACTIONS */}
                <div className="flex border-b">

                  {/* LIKE */}
                  <button
                    onClick={() =>
                      handleLike(
                        post.ID
                      )
                    }
                    className="flex-1 flex items-center justify-center gap-2 py-3 hover:bg-slate-50 transition"
                  >

                    <Heart
                      size={20}
                      className={
                        liked
                          ? "fill-red-500 text-red-500"
                          : "text-slate-600"
                      }
                    />

                    <span
                      className={
                        liked
                          ? "text-red-500 font-medium"
                          : "text-slate-700"
                      }
                    >
                      Like
                    </span>

                  </button>

                  {/* COMMENT */}
                  <button
                    onClick={() =>
                      setShowComments(
                        (
                          prev
                        ) => ({
                          ...prev,
                          [
                            post.ID
                          ]:
                            !prev[
                            post
                              .ID
                            ],
                        })
                      )
                    }
                    className="flex-1 flex items-center justify-center gap-2 py-3 hover:bg-slate-50 transition"
                  >

                    <MessageCircle
                      size={20}
                    />

                    <span>
                      Comment
                    </span>

                  </button>

                </div>

                {/* COMMENTS */}
                {showComments[
                  post.ID
                ] && (

                    <div className="p-4 space-y-4">

                      {/* INPUT */}
                      <div className="flex gap-2">

                        <input
                          type="text"
                          placeholder="Write a comment..."
                          value={
                            commentText[
                            post.ID
                            ] ||
                            ""
                          }
                          onChange={(
                            e
                          ) =>
                            setCommentText(
                              (
                                prev
                              ) => ({
                                ...prev,
                                [
                                  post
                                    .ID
                                ]:
                                  e
                                    .target
                                    .value,
                              })
                            )
                          }
                          className="flex-1 border rounded-2xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-900"
                        />

                        <button
                          onClick={() =>
                            handleComment(
                              post.ID
                            )
                          }
                          className="bg-blue-900 text-white px-5 rounded-2xl"
                        >
                          Post
                        </button>

                      </div>

                      {/* COMMENT LIST */}
                      <div className="space-y-3">

                        {post.comments?.map(
                          (
                            comment
                          ) => (

                            <div
                              key={
                                comment.ID
                              }
                              className="flex gap-3"
                            >

                              <div className="w-9 h-9 rounded-full bg-slate-300 flex items-center justify-center text-sm font-semibold">

                                {comment.user?.username
                                  ?.charAt(
                                    0
                                  )
                                  .toUpperCase()}

                              </div>

                              <div className="bg-slate-100 rounded-2xl px-4 py-2 flex-1">

                                <p className="font-semibold text-sm">
                                  {
                                    comment
                                      .user
                                      ?.username
                                  }
                                </p>

                                <p className="text-sm text-slate-700 mt-1">
                                  {
                                    comment.content
                                  }
                                </p>

                              </div>

                            </div>
                          )
                        )}

                      </div>

                    </div>
                  )}

              </div>
            );
          })}

        </div>

      </div>

    </div>
  );
}

export default OtherProfilePage;