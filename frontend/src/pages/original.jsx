// import { useEffect, useState } from "react";
// import API from "../services/api";
// import Navbar from "../components/Navbar";
// import { useRef } from "react";


// function ProfilePage() {

//   // ======================
//   // STATES
//   // ======================

//   const [user, setUser] = useState(null);
//   const [username, setUsername] = useState("");

//   const [loading, setLoading] = useState(true);
//   const fileInputRef = useRef(null);


//   const [error, setError] = useState("");

//   const [posts, setPosts] = useState([]);
//   const [editOpen, setEditOpen] = useState(false);

//   const [bio, setBio] = useState("");

//   const [avatarFile, setAvatarFile] = useState(null);

//   const [preview, setPreview] = useState("");


//   const [saving, setSaving] = useState(false);
//   const [newContent, setNewContent] = useState("");
//   const [newImage, setNewImage] = useState(null);

//   // ======================
//   // FETCH PROFILE
//   // ======================

//   const fetchProfile = async () => {

//     try {

//       setLoading(true);

//       const res = await API.get("/profile");

//       setUser(res.data);

//     } catch (err) {

//       if (err.response?.status === 401) {

//         setError("401 Unauthorized");

//         localStorage.removeItem("token");

//       } else {

//         setError("Failed to load profile");
//       }

//     } finally {

//       setLoading(false);
//     }
//   };

//   const fetchPosts = async () => {

//     try {

//       const res = await API.get("/myposts");

//       setPosts(res.data);

//     } catch (err) {

//       console.error("Failed to load posts", err);
//     }
//   };

//   useEffect(() => {
//     fetchProfile();
//     fetchPosts();
//   }, []);

//   // ======================
//   // OPEN EDIT MODAL
//   // ======================

//   const openEditModal = () => {

//     setUsername(user?.username || "");
//     setBio(user?.bio || "");

//     setPreview(
//       user?.avatar || ""
//     );

//     setAvatarFile(null);

//     setEditOpen(true);
//   };

//   // ======================
//   // HANDLE IMAGE CHANGE
//   // ======================

//   const handleImageChange = (e) => {

//     const file = e.target.files[0];

//     if (!file) return;

//     setAvatarFile(file);

//     // local preview
//     setPreview(
//       URL.createObjectURL(file)
//     );
//   };

//   // ======================
//   // UPDATE PROFILE
//   // ======================


//   const handleUpdateProfile = async () => {

//     try {

//       setSaving(true);

//       const formData = new FormData();

//       formData.append("username", username);
//       formData.append("bio", bio);

//       if (avatarFile) {
//         formData.append(
//           "avatar",
//           avatarFile
//         );
//       }

//       const res = await API.patch(
//         "/profile/update",
//         formData,
//         // {
//         //   headers: {
//         //     "Content-Type":
//         //       "multipart/form-data",
//         //   },
//         // }
//       );

//       setUser(res.data);
//       alert("Profile updated successfully!");

//       setEditOpen(false);

//     } catch (err) {

//       console.error(err);

//       alert(
//         err.response?.data?.error ||
//         "Profile update failed"
//       );

//     } finally {

//       setSaving(false);
//     }
//   };

//   // ======================
//   // LOADING
//   // ======================

//   if (loading) {
//     return (
//       <div className="
//         min-h-screen
//         flex
//         items-center
//         justify-center
//       ">
//         Loading...
//       </div>
//     );
//   }

//   // ======================
//   // ERROR
//   // ======================

//   if (error) {
//     return (
//       <div className="
//         min-h-screen
//         flex
//         items-center
//         justify-center
//         text-red-600
//         font-semibold
//       ">
//         {error}
//       </div>
//     );
//   }


//   const handleCreatePost = async () => {

//     try {

//       const formData = new FormData();

//       formData.append(
//         "content",
//         newContent
//       );

//       if (newImage) {
//         formData.append(
//           "image",
//           newImage
//         );
//       }

//       const res = await API.post(
//         "/posts",
//         formData
//       );

//       // setUser({
//       //   ...user,
//       //   posts: [
//       //     res.data,
//       //     ...user.posts,
//       //   ],
//       // });

//       // update UI instantly
//       setPosts([res.data, ...posts]);


//       setNewContent("");
//       setNewImage(null);

//       if (fileInputRef.current) {
//         fileInputRef.current.value = "";
//       }
//       // SUCCESS MESSAGE
//       alert("Post created successfully!");


//     } catch (err) {

//       console.error(err);

//       alert("Failed to create post");
//     }
//   };

//   const handleDeletePost = async (id) => {

//     try {

//       await API.delete(`/posts/${id}`);

//       // setUser({
//       //   ...user,
//       //   posts: user.posts.filter(
//       //     (p) => p.id !== id
//       //   ),
//       // });
//       setPosts(
//         posts.filter(
//           (p) => p.id !== id
//         )
//       );

//     } catch (err) {

//       console.error(err);

//       alert("Delete failed");
//     }
//   };



//   return (
//     <div className="min-h-screen bg-slate-100">

//       {/* NAVBAR */}
//       <Navbar />

//       <div className="
//         max-w-5xl
//         mx-auto
//         pt-24
//         px-4
//       ">

//         {/* PROFILE HEADER */}
//         <div className="
//           bg-white
//           rounded-3xl
//           shadow
//           p-8
//         ">

//           <div className="
//             flex
//             flex-col
//             md:flex-row
//             md:items-center
//             md:justify-between
//             gap-6
//           ">

//             {/* LEFT */}
//             <div className="
//               flex
//               items-center
//               gap-5
//             ">

//               <img
//                 src={
//                   user?.avatar ||
//                   "https://via.placeholder.com/120"
//                 }
//                 alt="avatar"
//                 className="
//                   w-28
//                   h-28
//                   rounded-full
//                   object-cover
//                   border-4
//                   border-slate-200
//                 "
//               />

//               <div>

//                 <h1 className="
//                   text-2xl
//                   font-bold
//                   text-slate-800
//                 ">
//                   {user?.username}
//                 </h1>

//                 <p className="
//                   text-slate-600
//                   mt-2
//                   max-w-md
//                 ">
//                   {user?.bio ||
//                     "No bio yet"}
//                 </p>
//                 <div className="
//                         flex
//                         items-center
//                         gap-6
//                         mt-3
//                 ">
//                   <div>
//                     <p className="
//                               text-xl
//                               font-bold
//                               text-slate-800
//                             ">
//                       {posts.length || 0}
//                     </p>

//                     <p className="
//       text-sm
//       text-slate-500
//     ">
//                       Posts
//                     </p>
//                   </div>

//                 </div>
//               </div>

//             </div>

//             {/* BUTTON */}
//             <button
//               onClick={openEditModal}
//               className="
//                 bg-blue-900
//                 text-white
//                 px-5
//                 py-3
//                 rounded-xl
//                 hover:opacity-90
//               "
//             >
//               Edit Profile
//             </button>

//           </div>

//         </div>

//         <div className="
//   bg-white
//   rounded-3xl
//   shadow
//   p-5
//   mt-8
// ">

//           <textarea
//             value={newContent}
//             onChange={(e) =>
//               setNewContent(e.target.value)
//             }
//             placeholder="What's on your mind?"
//             className="
//       w-full
//       border
//       rounded-xl
//       p-3
//       outline-none
//     "
//             rows={3}
//           />

//           <input
//             ref={fileInputRef}
//             type="file"
//             onChange={(e) =>
//               setNewImage(e.target.files[0])
//             }
//             className="mt-4"
//           />

//           <button
//             onClick={handleCreatePost}
//             disabled={!newContent && !newImage}
//             className="
//     mt-4
//     bg-blue-900
//     text-white
//     px-5
//     py-2
//     rounded-xl
//     hover:opacity-90
//     disabled:opacity-50
//   "
//           >
//             Create Post
//           </button>


//         </div>
//         {/* POSTS GRID */}
//         {/* POSTS GRID */}
//         {/* POSTS GRID */}
//         <div className="
//   mt-8
//   grid
//   grid-cols-1
//   sm:grid-cols-2
//   md:grid-cols-3
//   gap-5
// ">

//           {posts.length > 0 ? (

//             posts.map((post) => (

//               <div
//                 key={post.ID}
//                 className="
//           bg-white
//           rounded-2xl
//           shadow
//           overflow-hidden
//           flex
//           flex-col
//         "
//               >

//                 {/* IMAGE */}
//                 {post.image && (
//                   <img
//                     src={post.image}
//                     alt="post"
//                     className="
//               w-full
//               h-60
//               object-cover
//             "
//                   />
//                 )}

//                 {/* CONTENT */}
//                 <div className="
//           p-4
//           flex
//           flex-col
//           flex-1
//         ">

//                   {/* TEXT */}
//                   <p className="
//             text-sm
//             text-slate-700
//             leading-relaxed
//           ">
//                     {post.content}
//                   </p>

//                   {/* DATE */}
//                   <p className="
//             text-xs
//             text-slate-400
//             mt-3
//           ">
//                     {new Date(
//                       post.created_at
//                     ).toLocaleString()}
//                   </p>

//                   {/* ACTIONS */}
//                   <div className="
//             flex
//             justify-end
//             mt-4
//           ">

//                     <button
//                       onClick={() =>
//                         handleDeletePost(post.ID)
//                       }
//                       className="
//                 text-red-500
//                 text-sm
//                 hover:text-red-700
//               "
//                     >
//                       Delete
//                     </button>

//                   </div>

//                 </div>

//               </div>
//             ))

//           ) : (

//             <div className="
//       col-span-3
//       text-center
//       text-slate-500
//       py-10
//     ">
//               No posts yet
//             </div>
//           )}

//         </div>
//       </div>

//       {/* ======================
//           EDIT PROFILE MODAL
//       ====================== */}

//       {editOpen && (

//         <div className="
//           fixed
//           inset-0
//           bg-black/50
//           flex
//           items-center
//           justify-center
//           z-50
//           px-4
//         ">

//           <div className="
//             bg-white
//             rounded-3xl
//             shadow-xl
//             w-full
//             max-w-md
//             p-6
//           ">

//             {/* TITLE */}
//             <h2 className="
//               text-xl
//               font-bold
//               mb-5
//             ">
//               Edit Profile
//             </h2>

//             {/* IMAGE PREVIEW */}
//             <div className="
//               flex
//               justify-center
//               mb-5
//             ">

//               <img
//                 src={
//                   preview ||
//                   "https://via.placeholder.com/120"
//                 }
//                 alt="preview"
//                 className="
//                   w-28
//                   h-28
//                   rounded-full
//                   object-cover
//                   border-4
//                   border-slate-200
//                 "
//               />

//             </div>

//             {/* FILE INPUT */}
//             <div className="mb-4">

//               <label className="
//                 block
//                 text-sm
//                 font-medium
//                 text-slate-700
//                 mb-2
//               ">
//                 Upload Avatar
//               </label>

//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleImageChange}
//                 className="
//                   w-full
//                   border
//                   border-slate-300
//                   rounded-xl
//                   p-2
//                 "
//               />

//             </div>

//             <div className="mb-4">

//               <label className="
//     block
//     text-sm
//     font-medium
//     text-slate-700
//     mb-2
//   ">
//                 Username
//               </label>

//               <input
//                 type="text"
//                 value={username}
//                 onChange={(e) =>
//                   setUsername(e.target.value)
//                 }
//                 className="
//       w-full
//       border
//       border-slate-300
//       rounded-xl
//       p-3
//       outline-none
//       focus:ring-2
//       focus:ring-blue-900
//     "
//               />

//             </div>

//             {/* BIO */}
//             <div className="mb-5">

//               <label className="
//                 block
//                 text-sm
//                 font-medium
//                 text-slate-700
//                 mb-2
//               ">
//                 Bio
//               </label>

//               <textarea
//                 value={bio}
//                 onChange={(e) =>
//                   setBio(e.target.value)
//                 }
//                 rows={4}
//                 placeholder="Write something..."
//                 className="
//                   w-full
//                   border
//                   border-slate-300
//                   rounded-xl
//                   p-3
//                   outline-none
//                   focus:ring-2
//                   focus:ring-blue-900
//                 "
//               />

//             </div>

//             {/* ACTIONS */}
//             <div className="
//               flex
//               justify-end
//               gap-3
//             ">

//               <button
//                 onClick={() =>
//                   setEditOpen(false)
//                 }
//                 className="
//                   px-4
//                   py-2
//                   rounded-xl
//                   bg-slate-200
//                 "
//               >
//                 Cancel
//               </button>

//               <button
//                 onClick={handleUpdateProfile}
//                 disabled={saving}
//                 className="
//                   px-5
//                   py-2
//                   rounded-xl
//                   bg-blue-900
//                   text-white
//                   hover:opacity-90
//                 "
//               >
//                 {saving
//                   ? "Saving..."
//                   : "Save"}
//               </button>

//             </div>

//           </div>

//         </div>
//       )}

//     </div>
//   );
// }

// export default ProfilePage;