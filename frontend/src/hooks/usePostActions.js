import { useState } from "react";
import API from "../services/api";

function usePostActions(posts, setPosts) {

  // =====================
  // STATES
  // =====================

  const [editingPost, setEditingPost] =
    useState(null);

  const [editContent, setEditContent] =
    useState("");

  const [editImage, setEditImage] =
    useState(null);

  const [editPreview, setEditPreview] =
    useState("");

  const [removeImage, setRemoveImage] =
    useState(false);

  // =====================
  // OPEN EDIT MODAL
  // =====================

  const openEditPost = (post) => {

    setEditingPost(post);

    setEditContent(post.content);

    setEditPreview(post.image);

    setEditImage(null);

    setRemoveImage(false);
  };

  // =====================
  // DELETE POST
  // =====================

  const handleDeletePost = async (id) => {

    try {

      await API.delete(`/posts/${id}`);

      setPosts(
        posts.filter((p) => p.ID !== id)
      );

      alert("Post deleted!");

    } catch (err) {

      console.error(err);

      alert("Delete failed");
    }
  };

  // =====================
  // UPDATE POST
  // =====================

  const handleUpdatePost = async () => {

    try {

      const formData = new FormData();

      formData.append(
        "content",
        editContent
      );

      if (editImage) {

        formData.append(
          "image",
          editImage
        );
      }

      if (removeImage) {

        formData.append(
          "remove_image",
          "true"
        );
      }

      const res = await API.patch(
        `/posts/${editingPost.ID}`,
        formData
      );
      console.log(res.data);
      setPosts(

        posts.map((p) =>

          p.ID === editingPost.ID
            ? res.data
            : p
        )
      );

      setEditingPost(null);

      alert("Post updated!");

    } catch (err) {

      console.error(err);

      alert("Update failed");
    }
  };

  // =====================
  // CHANGE EDIT IMAGE
  // =====================

  const handleEditImageChange = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    setEditImage(file);

    setEditPreview(
      URL.createObjectURL(file)
    );

    setRemoveImage(false);
  };

  // =====================
  // REMOVE IMAGE
  // =====================

  const handleRemoveEditImage = () => {

    setEditPreview("");

    setEditImage(null);

    setRemoveImage(true);
  };

  return {

    // STATES
    editingPost,
    setEditingPost,

    editContent,
    setEditContent,

    editImage,
    setEditImage,

    editPreview,

    // ACTIONS
    openEditPost,
    handleDeletePost,
    handleUpdatePost,
    handleEditImageChange,
    handleRemoveEditImage,
  };
}

export default usePostActions;