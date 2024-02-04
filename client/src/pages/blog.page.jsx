import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "../components/loader.component";
import AnimationWrapper from "../common/page-animation";
import { getDay } from "../common/date";
import BlogInteraction from "../components/blog-interaction.component";
import BlogContent from "../components/blog-content.component";

export const blogStructure = {
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
  let [similarBlogs, setSimilarBlogs] = useState(null);
  let [loading, setLoading] = useState(true);

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
            <div className="mt-12">
              <h2>{title}</h2>
              <div className="flex max-sm:flex-col justify-between my-8">
                <div className="flex gap-5 items-start">
                  <img src={profile_img} className="w-12 h-12 rounded-full" />
                  <p className="capitalize">
                    {fullname}
                    <br />@
                    <Link to={`/user/${authorUsername}`} className="underline">
                      {authorUsername}
                    </Link>
                  </p>
                </div>
                <p className="text-zinc-600 opacity-75 max-sm:mt-6 max-sm:ml-12 max-sm:pl-5">
                  Published On {getDay(publishedAt)}
                </p>
              </div>
            </div>
            <BlogInteraction />
            <div className="blog-page-content">
              {content[0].blocks.map((blogItem, index) => {
                return (
                  <div className="my-4 md:my-8" key={index}>
                    <BlogContent item={blogItem} />
                  </div>
                );
              })}
            </div>
            <BlogInteraction />
          </div>
        )}
      </AnimationWrapper>
    </BlogContext.Provider>
  );
};
export default BlogPage;
