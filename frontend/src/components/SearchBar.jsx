import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import API from "../services/api";

function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({
    users: [],
    posts: [],
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSearch = async (value) => {
    setQuery(value);

    if (!value.trim()) {
      setResults({ users: [], posts: [] });
      return;
    }

    try {
      setLoading(true);

      const res = await API.get(`/search?q=${value}`);

      setResults(res.data);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const delay = setTimeout(() => {
      if (query) handleSearch(query);
    }, 300);

    return () => clearTimeout(delay);
  }, [query]);
  return (
    <div className="relative w-1/3 hidden md:flex">

      {/* INPUT */}
      <div className="
        flex items-center bg-slate-100 px-3 py-2 rounded-full w-full
      ">
        <Search size={18} className="text-slate-500" />

        <input
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search users or posts..."
          className="bg-transparent outline-none ml-2 w-full text-sm"
        />
      </div>

      {/* DROPDOWN */}
      {query && (
        <div className="
          absolute top-12 left-0 w-full bg-white shadow-lg border rounded-xl max-h-96 overflow-y-auto z-50
        ">

          {/* USERS */}
          {results.users?.length > 0 && (
            <div className="p-2">
              <p className="text-xs text-slate-400">Users</p>

              {results.users.map((user) => (
                <div
                  key={user.id}
                  onClick={() => {
                    navigate(`/profile/${user.ID}`);
                    setQuery("");
                    setResults({ users: [], posts: [] });
                  }}
                  className="flex items-center gap-2 p-2 hover:bg-slate-100 rounded cursor-pointer"
                >
                  <div className="w-8 h-8 bg-slate-300 rounded-full flex items-center justify-center">
                    {user.username?.charAt(0)}
                  </div>

                  <span className="text-sm">{user.username}</span>
                </div>
              ))}
            </div>
          )}

          {/* POSTS */}
          {results.posts?.length > 0 && (
            <div className="p-2 border-t">
              <p className="text-xs text-slate-400">Posts</p>

              {results.posts.map((post) => (
                <div
                  key={post.ID}
                  onClick={() => {
                    navigate(`/post/${post.ID}`);
                    setQuery("");
                    setResults({ users: [], posts: [] });
                  }}
                  className="p-2 hover:bg-slate-100 rounded cursor-pointer"
                >
                  <p className="text-sm line-clamp-1">
                    {post.content}
                  </p>
                </div>
              ))}
            </div>
          )}

        </div>
      )}

    </div>
  );
}

export default SearchBar;