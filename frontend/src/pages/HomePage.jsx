import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";
import usePostActions from "../hooks/usePostActions";
import PostCard from "../components/posts/PostCard";
import EditPostModal from "../components/profile/EditPostModal";
import Sidebar from "../components/sidebar/Sidebar";
import Trending from "../components/feed/Trending";
import CreatePost from "../components/posts/CreatePost";
import SuggestedFriends from "../components/sidebar/SuggestedFriends";
// import PostCard from "../components/PostCard";

function HomePage() {

  // ======================
  // STATES
  // ======================

  const [posts, setPosts] = useState([]);


  const [user, setUser] = useState(null);

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

  // ======================
  // CURRENT USER
  // ======================

  const token = localStorage.getItem("token");

  let currentUserId = null;

  if (token) {
    try {
      const payload = JSON.parse(
        atob(token.split(".")[1])
      );

      currentUserId = payload.user_id;

    } catch (err) {
      console.error("Invalid token");
    }
  }

  // ======================
  // FETCH POSTS
  // ======================

  const fetchPosts = async () => {

    try {

      const res = await API.get("/posts");


      setPosts(res.data);

    } catch (err) {

      console.error(err);

    }
  };

  const fetchProfile = async () => {
    try {
      const res = await API.get("/profile");
      setUser(res.data);
    } catch (err) {
      setUser(null);
    }
  };
  useEffect(() => {
    fetchPosts();
    fetchProfile();
  }, []);



  console.log("Current User ID:", currentUserId);


  return (
    <div className="min-h-screen bg-slate-100">

      {/* HEADER */}
      <Navbar />

      {/* MAIN WRAPPER */}
      <div className="
        max-w-7xl
        mx-auto
        pt-20
        px-4
        grid
        grid-cols-1
        lg:grid-cols-12
        gap-6
      ">

        {/* LEFT SIDEBAR */}
        <Sidebar />

        {/* CENTER FEED */}
        <main className="lg:col-span-6 space-y-5">

          {/* CREATE POST CARD */}
          <CreatePost
            user={user}
            fetchPosts={fetchPosts}
          />

          {/* FEED POSTS */}
          <div className="space-y-5">

            {posts.map((post) => (

              <PostCard
                key={post.ID}
                post={post}
                currentUserId={currentUserId}
                openEditPost={openEditPost}
                handleDeletePost={handleDeletePost}
              />

            ))}

          </div>

        </main>

        {/* RIGHT SIDEBAR */}
        <aside className="
          lg:col-span-3
          hidden lg:block
          sticky top-24
          h-fit
          space-y-4
        ">

          {/* SUGGESTIONS */}
          <div className="bg-white rounded-2xl shadow p-4">

            <h3 className="font-semibold mb-3">
              People You May Know
            </h3>

            <SuggestedFriends />

          </div>

          {/* TRENDING */}
          <Trending />

        </aside>

      </div>
      {/* EDIT MODAL */}
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

export default HomePage;