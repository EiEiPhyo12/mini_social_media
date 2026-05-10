import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthCard from "../components/auth/AuthCard";
// import PasswordInput from "../components/auth/PasswordInput";

import API from "../services/api";

function LoginPage() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  // =========================
  // HANDLE INPUT CHANGE
  // =========================

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // HANDLE LOGIN
  // =========================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    // Validation
    if (!form.email || !form.password) {

      setError("Please fill all fields");

      return;
    }

    try {

      setLoading(true);

      // API Request
      const response = await API.post(
        "/login",
        form
      );

      // Save JWT Token
      localStorage.setItem(
        "token",
        response.data.token
      );

      // Redirect to Home
      navigate("/home", {
        state: {
          message: "Login successful 🎉 Welcome back!",
          type: "success",
        },
      });

    } catch (err) {

      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Login failed. Please try again."
      );

    } finally {

      setLoading(false);
    }
  };

  return (
    <div
      className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-gradient-to-br
        from-slate-100
        to-slate-200
        px-4
      "
    >

      <AuthCard
        title="Welcome Back"
        subtitle="Login to continue your journey"
      >

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* ERROR MESSAGE */}
          {error && (

            <div
              className="
                bg-red-100
                border
                border-red-300
                text-red-700
                px-4
                py-3
                rounded-xl
                text-sm
                font-medium
              "
            >
              {error}
            </div>
          )}

          {/* EMAIL INPUT */}
          <div>

            <label
              className="
                block
                mb-2
                text-sm
                font-medium
                text-slate-700
              "
            >
              Email Address
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
              placeholder="Enter your email"
              className="
                w-full
                px-4
                py-3
                rounded-xl
                border
                border-slate-300
                bg-white
                focus:outline-none
                focus:ring-2
                focus:ring-blue-900
                transition-all
              "
            />

          </div>

          {/* PASSWORD INPUT */}
          <div>

            <label
              className="
                block
                mb-2
                text-sm
                font-medium
                text-slate-700
              "
            >
              Password
            </label>
            {/* <PasswordInput
              name="password"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
            /> */}

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
              placeholder="Enter your password"
              className="
    w-full
    px-4
    py-3
    rounded-xl
    border
    border-slate-300
    bg-white
    focus:outline-none
    focus:ring-2
    focus:ring-blue-900
    transition-all
  "
            />

          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className={`
              w-full
              py-3
              rounded-xl
              font-semibold
              shadow-md
              transition-all
              duration-200

              ${loading
                ? `
                  bg-slate-400
                  cursor-not-allowed
                `
                : `
                  bg-blue-900
                  text-white
                  hover:opacity-90
                  hover:scale-[1.01]
                `
              }
            `}
          >

            {loading
              ? "Logging in..."
              : "Login"
            }

          </button>

          {/* FOOTER */}
          <p
            className="
              text-center
              text-sm
              text-slate-500
            "
          >

            Don't have an account?

            <Link
              to="/register"
              className="
                ml-1
                text-blue-900
                font-medium
                hover:underline
              "
            >
              Sign Up
            </Link>

          </p>

        </form>

      </AuthCard>

    </div>
  );
}

export default LoginPage;