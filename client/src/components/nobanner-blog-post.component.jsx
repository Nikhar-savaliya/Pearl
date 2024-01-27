import { Link } from "react-router-dom";
import { getDay } from "../common/date";

const MinimalBlogPost = ({ blog, index }) => {
  let {
    title,
    blog_id: id,
    author: {
      personal_info: { fullname, username, profile_img },
    },
    publishedAt,
  } = blog;

  return (
    <Link
      to={`blog/${id}`}
      className="w-full flex gap-8 items-center justify-start border-b border-zinc-200 pb-5 mb-4"
    >
      <div className="">
        <h1 className="blog-title font-semibold text-zinc-600 text-base leading-6 mb-2">
          {title}
        </h1>
        <div className="flex gap-2 items-center text-zinc-500 ">
          <img src={profile_img} className="w-6 h-6 rounded-full" />
          <p className="line-clamp-1 text-sm">@{username} · </p>
          <p className="min-w-fit text-sm">{getDay(publishedAt)}</p>
        </div>
      </div>
    </Link>
  );
};
export default MinimalBlogPost;
