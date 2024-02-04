import { useContext } from "react";
import { BlogContext } from "../pages/blog.page";
import { Heart, MessageCircleMore, Twitter } from "lucide-react";
import { Link } from "react-router-dom";
import { UserContext } from "../App";

const BlogInteraction = () => {
  const {
    blog: {
      title,
      blog_id,
      activity: { total_likes, total_comments },
      author: {
        personal_info: { username: author_username },
      },
    },
    setBlog,
  } = useContext(BlogContext);

  let {
    userAuth: { username },
  } = useContext(UserContext);

  return (
    <>
      <hr className="border-zinc-200" />

      <div className="flex gap-6 py-2 justify-between">
        <div className="flex gap-3 items-center">
          <button className="w-10 h-10 rounded-full text-zinc-600 flex items-center justify-center ">
            <Heart width={40} />
          </button>
          <p className="text-xl text-zinc-600">{total_likes}</p>

          <button className="w-10 h-10 rounded-full text-zinc-600 flex items-center justify-center ">
            <MessageCircleMore width={36} />
          </button>
          <p className="text-xl text-zinc-600">{total_comments}</p>
        </div>

        <div className="flex gap-6 items-center justify-center cursor-pointer">
          {username == author_username ? (
            <Link
              to={`/editor/${blog_id}`}
              className="underline hover:text-emerald-600"
            >
              Edit
            </Link>
          ) : (
            ""
          )}
          <Link
            to={`https://twitter.com/intent/tweet?text=Read ${title}&url=${location.herf}`}
            className="hover:text-emerald-600"
          >
            <Twitter width={36} />
          </Link>
        </div>
      </div>

      <hr className="border-zinc-200" />
    </>
  );
};

export default BlogInteraction;
