import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import API from "../services/api";

import usePostActions
  from "../hooks/usePostActions";

import Navbar from "../components/Navbar";

import PostCard
  from "../components/posts/PostCard";

import EditPostModal
  from "../components/profile/EditPostModal";

function PostDetailPage() {

  const { id } = useParams();

  const [post, setPost] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  // =========================
  // TEMP POSTS ARRAY
  // =========================

  const posts = post ? [post] : [];

  const setPosts = (updatedPosts) => {

    if (
      typeof updatedPosts === "function"
    ) {

      const result =
        updatedPosts(posts);

      setPost(result[0]);

    } else {

      setPost(updatedPosts[0]);
    }
  };

  // =========================
  // POST ACTIONS
  // =========================

  const {

    editingPost,
    setEditingPost,

    editContent,
    setEditContent,

    editImage,
    setEditImage,

    editPreview,

    openEditPost,

    handleDeletePost,
    handleUpdatePost,

    handleEditImageChange,
    handleRemoveEditImage,

  } = usePostActions(
    posts,
    setPosts
  );

  // =========================
  // CURRENT USER
  // =========================

  const token =
    localStorage.getItem("token");

  let currentUserId = null;

  if (token) {

    try {

      const payload = JSON.parse(
        atob(token.split(".")[1])
      );

      currentUserId =
        payload.user_id;

    } catch (err) {

      console.error(
        "Invalid token"
      );
    }
  }

  // =========================
  // FETCH POST
  // =========================

  useEffect(() => {

    const fetchPost =
      async () => {

        try {

          setLoading(true);

          const res =
            await API.get(
              `/posts/${id}`
            );

          setPost(res.data);

        } catch (err) {

          console.error(err);

        } finally {

          setLoading(false);
        }
      };

    fetchPost();

  }, [id]);

  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (

      <div className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-slate-100
      ">

        <p className="
          text-slate-500
          text-lg
        ">
          Loading post...
        </p>

      </div>
    );
  }

  // =========================
  // NOT FOUND
  // =========================

  if (!post) {

    return (

      <div className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-slate-100
      ">

        <p className="
          text-red-500
          text-lg
        ">
          Post not found
        </p>

      </div>
    );
  }

  return (

    <div className="
      min-h-screen
      bg-slate-100
    ">

      <Navbar />

      <div className="
        max-w-3xl
        mx-auto
        pt-24
        pb-10
        px-4
      ">

        <PostCard
          post={post}
          currentUserId={
            currentUserId
          }
          openEditPost={
            openEditPost
          }
          handleDeletePost={
            handleDeletePost
          }
        />

      </div>

      {/* EDIT MODAL */}

      <EditPostModal
        editingPost={editingPost}
        editContent={editContent}
        setEditContent={
          setEditContent
        }
        setEditingPost={
          setEditingPost
        }
        handleUpdatePost={
          handleUpdatePost
        }
        editPreview={editPreview}
        editImage={editImage}
        setEditImage={
          setEditImage
        }
        handleEditImageChange={
          handleEditImageChange
        }
        handleRemoveEditImage={
          handleRemoveEditImage
        }
      />

    </div>
  );
}

export default PostDetailPage;