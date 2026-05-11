import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import HomePage from "./pages/HomePage";
import PostDetailPage from "./pages/PostDetailPage";
import OtherProfilePage from "./pages/OtherProfilePage";
import MyPostsPage from "./pages/MyPostsPage";

function App() {

  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/register"
          element={<RegisterPage />}
        />
        <Route
          path="/"
          element={<HomePage />}
        />
        <Route
          path="/profile"
          element={<ProfilePage />}
        />

        <Route
          path="/myposts"
          element={<MyPostsPage />}
        />

        {/* other routes */}
        <Route path="/profile/:id" element={<OtherProfilePage />} />

        <Route
          path="/post/:id"
          element={<PostDetailPage />}
        />
      </Routes>

    </BrowserRouter>
  );
}

export default App;