function SuggestedFriends() {
  return (
    <div className="bg-white p-4 rounded-2xl border shadow-sm">

      <h3 className="font-semibold mb-3">
        Suggested Friends
      </h3>

      <div className="space-y-3">

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-2">
            <img
              src="https://i.pravatar.cc/30"
              className="rounded-full"
            />
            <span className="text-sm">Alice</span>
          </div>

          <button className="text-blue-900 text-sm">
            Follow
          </button>

        </div>

      </div>

    </div>
  );
}

export default SuggestedFriends;