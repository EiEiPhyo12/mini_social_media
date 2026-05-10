import PostCard from "./PostCard";

function PostsGrid({
  posts,
  currentUserId,
  handleDeletePost,
  openEditPost
}) {

  return (

    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">

      {posts.length > 0 ? (

        posts.map((post) => (

          <PostCard
            key={post.ID}
            post={post}
            currentUserId={currentUserId}
            handleDeletePost={
              handleDeletePost
            }
            openEditPost={openEditPost}
          />
        ))

      ) : (

        <div className="col-span-3 text-center text-slate-500 py-10">
          No posts yet
        </div>
      )}

    </div>
  );
}

export default PostsGrid;