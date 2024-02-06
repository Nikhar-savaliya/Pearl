import { useContext } from "react";
import { BlogContext } from "../pages/blog.page";
import { Heart, MessageCircleMore, Twitter } from "lucide-react";
import { Link } from "react-router-dom";
import { UserContext } from "../App";
import toast, { Toaster } from "react-hot-toast";

const BlogInteraction = () => {
  let {
    blog: {
      title,
      blog_id,
      activity: { total_likes, total_comments },
      author: {
        personal_info: { username: author_username },
      },
    },
    setBlog,
    blog,
    isLikedByUser,
    setIsLikedByUser,
  } = useContext(BlogContext);

  let {
    userAuth: { username, access_token },
  } = useContext(UserContext);

  // @handleLike
  const handleLike = () => {
    if (access_token) {
      setIsLikedByUser((isLikedByUser) => !isLikedByUser);
      isLikedByUser ? total_likes++ : total_likes--;
      setBlog({ ...blog, total_likes });
    } else {
      toast.dismiss();
      toast.error("you must Login to like blogs");
    }
  };

  return (
    <>
      <Toaster />
      <hr className="border-zinc-200" />

      <div className="flex gap-8 py-2 justify-between">
        <div className="flex gap-6 items-center">
          <div className="flex items-center justify-center">
            <button
              className="w-10 h-10 rounded-full text-zinc-600 flex items-center justify-center"
              onClick={handleLike}
            >
              <Heart
                width={40}
                className={
                  "transition-colors duration-100" + isLikedByUser
                    ? " text-rose-800"
                    : " text-zinc-600"
                }
                fill={isLikedByUser ? "rgb(159 18 57)" : "rgb(250 250 250)"}
              />
            </button>
            <p className="text-xl text-zinc-600">{total_likes}</p>
          </div>

          <div className="flex items-center justify-center">
            <button className="w-10 h-10 rounded-full text-zinc-600 flex items-center justify-center ">
              <MessageCircleMore width={36} />
            </button>
            <p className="text-xl text-zinc-600">{total_comments}</p>
          </div>
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
