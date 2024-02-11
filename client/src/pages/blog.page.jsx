import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "../components/loader.component";
import AnimationWrapper from "../common/page-animation";
import { getDay } from "../common/date";
import BlogInteraction from "../components/blog-interaction.component";
import BlogContent from "../components/blog-content.component";

export const blogStructure = {
  _id: "",
  blog_id: "",
  title: "",
  description: "",
  content: [],
  banner: "",
  author: { personal_info: { username: "", fullname: "", profile_img: "" } },
  activity: {
    total_likes: 0,
    total_comments: 0,
    total_reads: 0,
    total_parent_comments: 0,
  },
  comments: [],
  tags: [],
  publishedAt: "",
};

export const BlogContext = createContext();

const BlogPage = () => {
  const { blogId } = useParams();

  let [blog, setBlog] = useState(blogStructure);
  let [loading, setLoading] = useState(true);
  // let [isLikedByUser, setIsLikedByUser] = useState(false);

  let {
    title,
    description,
    content,
    banner,
    author: {
      personal_info: { username: authorUsername, fullname, profile_img },
    },
    publishedAt,
    tags,
  } = blog;

  const getBlog = () => {
    axios
      .post(import.meta.env.VITE_SERVER_URL + "/get-blog", { blogId })
      .then(({ data }) => {
        // console.log(data.blog);
        setBlog(data.blog);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(true);
      });
  };

  useEffect(() => {
    getBlog();
  }, []);
  return (
    <BlogContext.Provider value={{ blog, setBlog }}>
      <AnimationWrapper className={"bg-zinc-50"}>
        {loading ? (
          <Loader />
        ) : (
          <div className="max-w-4xl center py-10 max-lg:px-[5vw]">
            <img src={banner} className="aspect-video" />
            <div className="mt-12 border-b">
              <h2>{title}</h2>
              <div className="flex justify-between items-center py-3">
                <div className="flex gap-2 items-center mt-2 text-zinc-500 ">
                  <img
                    src={profile_img}
                    className="w-6 h-6 rounded-full bg-zinc-50"
                  />
                  <p className="line-clamp-1">
                    @
                    <Link
                      to={`/user/${authorUsername}`}
                      className="hover:underline"
                    >
                      {authorUsername}
                    </Link>{" "}
                    ·{" "}
                  </p>
                  <p className="min-w-fit">{getDay(publishedAt)}</p>
                </div>
              </div>
            </div>
            {/* <BlogInteraction /> */}
            <div className="blog-page-content">
              {content[0].blocks.map((blogItem, index) => {
                return (
                  <div className="my-4 md:my-8" key={index}>
                    <BlogContent item={blogItem} />
                  </div>
                );
              })}
            </div>
            {/* <BlogInteraction /> */}
          </div>
        )}
      </AnimationWrapper>
    </BlogContext.Provider>
  );
};
export default BlogPage;
