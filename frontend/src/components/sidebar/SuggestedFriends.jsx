import { useEffect, useState } from "react";
import API from "../../services/api";

function SuggestedFriends() {
  const [suggestions, setSuggestions] =
    useState([]);

  const fetchSuggestions = async () => {

    try {

      const res = await API.get(
        "/users/suggestions"
      );

      setSuggestions(res.data);

    } catch (err) {

      console.error(err);
    }
  };

  useEffect(() => {

    fetchSuggestions();

  }, []);
  return (
    <div className="space-y-3">

      {suggestions.map((user) => (

        <div
          key={user.id}
          className="
        flex
        items-center
        justify-between
      "
        >

          <div className="
        flex
        items-center
        gap-3
      ">

            {user.avatar ? (
              <img
                src={user.avatar}
                alt="avatar"
                className="
      w-10
      h-10
      rounded-full
      object-cover
    "
              />
            ) : (
              <div className="
    w-10
    h-10
    rounded-full
    bg-slate-300
    flex
    items-center
    justify-center
    text-sm
    font-bold
    text-slate-700
  ">
                {user.username?.charAt(0).toUpperCase() || "U"}
              </div>
            )}

            <div>

              <p className="
            text-sm
            font-medium
            text-slate-800
          ">
                {user.username}
              </p>



            </div>

          </div>

          <button
            className="
          text-sm
          bg-blue-900
          text-white
          px-3
          py-1
          rounded-lg
        "
          >
            Follow
          </button>

        </div>
      ))}

    </div>)
}

export default SuggestedFriends;