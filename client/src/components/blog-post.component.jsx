import { getDay } from "../common/date";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
const BlogPostCard = ({ content, author }) => {
  let {
    publishedAt,
    tags,
    title,
    banner,
    description,
    activity: { total_likes },
    blog_id: id,
  } = content;
  let { username, profile_img } = author;
  return (
    <Link
      to={`/blog/${id}`}
      className="w-full flex gap-8 items-center justify-between border-b border-zinc-200 pb-5 mb-4"
    >
      <div className="w-full">
        <div className="mt-4">
          <h1 className="blog-title font-semibold ">{title}</h1>
          <p className="my-2 text-lg leading-7 max-sm:hidden md:max-[1100px]:hidden line-clamp-2 text-zinc-700">
            {description}
          </p>
        </div>

        <div className="flex gap-2 items-center mt-2 text-zinc-500 ">
          <img src={profile_img} className="w-6 h-6 rounded-full bg-zinc-50" />
          <p className="line-clamp-1">@{username} · </p>
          <p className="min-w-fit">{getDay(publishedAt)}</p>
          {/* <span className="ml-3 flex items-center gap-2 text-zinc-400">
            <Heart width={16} />
            {total_likes}
          </span> */}
        </div>

        <div className="flex gap-2 my-4 flex-wrap">
          <span className="tag py-1 px-4 text-sm bg-zinc-200/70 rounded-full capitalize">
            {tags[0]}
          </span>
          {tags[1] && (
            <span className="tag py-1 px-4 text-sm bg-zinc-200/70 rounded-full capitalize">
              {tags[1]}
            </span>
          )}
          {tags[2] && (
            <span className="tag py-1 px-4 text-sm bg-zinc-200/70 rounded-full capitalize">
              {tags[2]}
            </span>
          )}
        </div>
      </div>
      <div className="h-28 aspect-square bg-zinc-200">
        <img
          src={banner}
          alt="banner image"
          className="w-full h-full aspect-square object-cover bg-zinc-50"
        />
      </div>
    </Link>
  );
};

export default BlogPostCard;
