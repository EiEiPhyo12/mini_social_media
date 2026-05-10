import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import API from "../services/api";
import AuthCard from "../components/auth/AuthCard";

function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async () => {
    setError("");

    try {
      setLoading(true);

      await API.post("/register", form);

      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 px-4">
      <AuthCard title="Create Account" subtitle="Join the social community">
        <div className="space-y-5">

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-xl text-sm font-medium shadow-sm">
              {error}
            </div>
          )}

          {/* Username */}
          <div>
            <label className="block mb-2 text-sm font-medium text-slate-700">
              Username
            </label>

            <input
              type="text"
              name="username"
              placeholder="Enter username"
              value={form.username}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-900 transition-all"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-2 text-sm font-medium text-slate-700">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter email address"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-900 transition-all"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-2 text-sm font-medium text-slate-700">
              Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
              className="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-900 transition-all"
            />
          </div>

          {/* Button */}
          <button
            type="button"
            onClick={handleRegister}
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold shadow-md transition-all duration-200 ${loading
                ? "bg-slate-400 cursor-not-allowed"
                : "bg-blue-900 text-white hover:opacity-90 hover:scale-[1.01]"
              }`}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          {/* Footer */}
          <p className="text-center text-sm text-slate-500">
            Already have an account?
            <Link to="/login" className="text-blue-900 ml-1 font-medium hover:underline">
              Login
            </Link>
          </p>
        </div>
      </AuthCard>
    </div>
  );
}

export default RegisterPage;