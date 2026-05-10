function AuthCard({
  title,
  subtitle,
  children
}) {

  return (
    <div
      className="
        w-full
        max-w-md
        bg-white
        rounded-3xl
        shadow-xl
        border
        border-slate-200
        p-8
      "
    >

      <div className="mb-8 text-center">

        <h1
          className="
            text-3xl
            font-bold
            text-slate-900
          "
        >
          {title}
        </h1>

        <p
          className="
            mt-2
            text-slate-500
          "
        >
          {subtitle}
        </p>

      </div>

      {children}

    </div>
  );
}

export default AuthCard;