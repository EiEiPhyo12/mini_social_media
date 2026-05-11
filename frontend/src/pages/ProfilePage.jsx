import { useEffect, useRef, useState } from "react";

import API from "../services/api";

import Navbar from "../components/Navbar";

import usePostActions
  from "../hooks/usePostActions";
import EditPostModal from
  "../components/profile/EditPostModal";
import ProfileHeader from "../components/profile/ProfileHeader";
import CreatePostBox from "../components/profile/CreatePostBox";
import PostsGrid from "../components/profile/PostsGrid";
import EditProfileModal from "../components/profile/EditProfileModal";

function ProfilePage() {

  const [user, setUser] = useState(null);

  const [posts, setPosts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [editOpen, setEditOpen] = useState(false);

  const [username, setUsername] = useState("");

  const [bio, setBio] = useState("");

  const [preview, setPreview] = useState("");

  const [avatarFile, setAvatarFile] = useState(null);

  const [saving, setSaving] = useState(false);

  const [newContent, setNewContent] = useState("");

  const [newImage, setNewImage] = useState(null);
  const token = localStorage.getItem("token");

  let currentUserId = null;

  if (token) {

    try {

      const payload = JSON.parse(
        atob(token.split(".")[1])
      );
      console.log("payload:", payload);
      currentUserId = payload.user_id;
      console.log("current user id:", currentUserId);

    } catch (err) {

      console.error("Invalid token");
    }
  }
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

  } = usePostActions(posts, setPosts);
  // const [editingPost, setEditingPost] = useState(null);

  // const [editContent, setEditContent] = useState("");

  // const [editImage, setEditImage] = useState(null);

  // const [removeImage, setRemoveImage] =
  //   useState(false);

  // const [editPreview, setEditPreview] =
  //   useState("");
  const fileInputRef = useRef(null);

  // =====================
  // FETCH PROFILE
  // =====================

  const fetchProfile = async () => {

    try {

      setLoading(true);

      const res = await API.get("/profile");

      setUser(res.data);

    } catch (err) {

      if (err.response?.status === 401) {

        setError("401 Unauthorized");

        localStorage.removeItem("token");

      } else {

        setError("Failed to load profile");
      }

    } finally {

      setLoading(false);
    }
  };

  // =====================
  // FETCH POSTS
  // =====================

  const fetchPosts = async () => {

    try {

      const res = await API.get("/myposts");
      console.log(res);

      setPosts(res.data);

    } catch (err) {

      console.error(err);
    }
  };

  useEffect(() => {

    fetchProfile();

    fetchPosts();

  }, []);

  // =====================
  // OPEN MODAL
  // =====================

  const openEditModal = () => {

    setUsername(user?.username || "");

    setBio(user?.bio || "");

    setPreview(user?.avatar || "");

    setAvatarFile(null);

    setEditOpen(true);
  };

  // =====================
  // IMAGE CHANGE
  // =====================

  const handleImageChange = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    setAvatarFile(file);

    setPreview(URL.createObjectURL(file));
  };

  // =====================
  // UPDATE PROFILE
  // =====================

  const handleUpdateProfile = async () => {

    try {

      setSaving(true);

      const formData = new FormData();

      formData.append("username", username);

      formData.append("bio", bio);

      if (avatarFile) {

        formData.append("avatar", avatarFile);
      }

      const res = await API.patch(
        "/profile/update",
        formData
      );

      setUser(res.data);

      alert("Profile updated!");

      setEditOpen(false);

    } catch (err) {

      console.error(err);

      alert("Update failed");

    } finally {

      setSaving(false);
    }
  };

  // =====================
  // CREATE POST
  // =====================

  const handleCreatePost = async () => {

    try {

      const formData = new FormData();

      formData.append("content", newContent);

      if (newImage) {

        formData.append("image", newImage);
      }

      const res = await API.post(
        "/posts",
        formData
      );

      setPosts([res.data, ...posts]);

      setNewContent("");

      setNewImage(null);

      if (fileInputRef.current) {

        fileInputRef.current.value = "";
      }

      alert("Post created!");

    } catch (err) {

      console.error(err);

      alert("Create post failed");
    }
  };

  // =====================
  // DELETE POST
  // =====================



  // =====================
  // LOADING
  // =====================

  if (loading) {

    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  // =====================
  // ERROR
  // =====================

  if (error) {

    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }



  // =====================
  // TOTAL LIKES
  // =====================

  const totalLikes = posts.reduce(
    (total, post) =>
      total + (post.likes?.length || 0),
    0
  );

  return (

    <div className="min-h-screen bg-slate-100">

      <Navbar />

      <div className="max-w-5xl mx-auto pt-24 px-4">

        <ProfileHeader
          user={user}
          postsCount={posts.length}
          likesCount={totalLikes}
          openEditModal={openEditModal}
        />

        <CreatePostBox
          newContent={newContent}
          setNewContent={setNewContent}
          setNewImage={setNewImage}
          handleCreatePost={handleCreatePost}
          fileInputRef={fileInputRef}
        />

        <PostsGrid
          posts={posts}
          currentUserId={currentUserId}
          handleDeletePost={handleDeletePost}
          openEditPost={openEditPost}
        />

      </div>

      <EditProfileModal
        editOpen={editOpen}
        setEditOpen={setEditOpen}
        preview={preview}
        username={username}
        setUsername={setUsername}
        bio={bio}
        setBio={setBio}
        saving={saving}
        handleImageChange={handleImageChange}
        handleUpdateProfile={handleUpdateProfile}
      />
      <EditPostModal
        editingPost={editingPost}
        editContent={editContent}
        setEditContent={setEditContent}
        setEditingPost={setEditingPost}
        handleUpdatePost={handleUpdatePost}
        editPreview={editPreview}
        editImage={editImage}
        setEditImage={setEditImage}
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

export default ProfilePage;