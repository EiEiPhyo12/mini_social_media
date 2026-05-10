function Sidebar() {
  return (
    <aside className="
          lg:col-span-3
          hidden lg:block
          sticky top-24
          h-fit
        ">
      <div className="bg-white rounded-2xl shadow p-4 space-y-4">

        <div className="font-semibold text-slate-700">
          Navigation
        </div>

        <div className="space-y-2 text-sm text-slate-600">
          <p className="hover:bg-slate-100 p-2 rounded-lg cursor-pointer">
            🏠 Home
          </p>

          <p className="hover:bg-slate-100 p-2 rounded-lg cursor-pointer">
            👥 Friends
          </p>

          <p className="hover:bg-slate-100 p-2 rounded-lg cursor-pointer">
            🎥 Videos
          </p>

          <p className="hover:bg-slate-100 p-2 rounded-lg cursor-pointer">
            ⚙️ Settings
          </p>
        </div>

      </div>
    </aside>
  );
}

export default Sidebar;