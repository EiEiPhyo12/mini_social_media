import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

function PasswordInput({
  value,
  onChange,
  name,
  autoComplete = "current-password"
}) {

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">

      <input
        type={showPassword ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        required
        autoComplete={autoComplete}
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

      <button
        type="button"
        onClick={() => setShowPassword(prev => !prev)}
        className="
          absolute
          right-4
          top-1/2
          -translate-y-1/2
          text-slate-500
        "
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>

    </div>
  );
}

export default PasswordInput;