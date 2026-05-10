import { Image } from "lucide-react";

function CreatePost() {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border">

      <div className="flex gap-3 items-start">

        <img
          src="https://i.pravatar.cc/40"
          className="w-10 h-10 rounded-full"
        />

        <textarea
          placeholder="What's on your mind?"
          className="
            w-full
            bg-slate-50
            p-3
            rounded-xl
            border
            focus:outline-none
            focus:ring-2
            focus:ring-blue-900
          "
        />

      </div>

      <div className="flex justify-between mt-3 items-center">

        <button className="text-slate-500 hover:text-blue-900">
          <Image size={20} />
        </button>

        <button className="
          bg-blue-900
          text-white
          px-5
          py-2
          rounded-xl
          hover:opacity-90
        ">
          Post
        </button>

      </div>

    </div>
  );
}

export default CreatePost;