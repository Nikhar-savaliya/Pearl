import { useParams } from "react-router-dom";
import InPageNavigation from "../components/inpage-navigation.component";
import { useEffect, useState } from "react";
import Loader from "../components/loader.component";
import AnimationWrapper from "../common/page-animation";
import NoDataMessage from "../components/nodata.component";
import LoadMoreDataButton from "../components/load-more.component";
import axios from "axios";
import { filterPaginationData } from "../common/filter-pagination-data";
import MinimalBlogPost from "../components/nobanner-blog-post.component";
import BlogPostCard from "../components/blog-post.component";

const SearchPage = () => {
  const { query } = useParams();
  let [blogs, setBlogs] = useState(null);
  let [users, setUsers] = useState(null);

  const searchBlogs = ({ page = 1, createNewArray = false }) => {
    axios
      .post(import.meta.env.VITE_SERVER_URL + "/search-blogs", { query, page })
      .then(async ({ data }) => {
        let formatdata = await filterPaginationData({
          blogState: blogs,
          newData: data.blogs,
          page: page,
          countRoute: "/search-blogs-count",
          dataToSend: { query },
          createNewArray,
        });
        setBlogs(formatdata);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const resetState = () => {
    setBlogs(null);
  };
  const fetchUsers = () => {
    axios
      .post(import.meta.env.VITE_SERVER_URL + "/seach-  users", { query })
      .then(({ data: { users } }) => {
        console.log(users);
      })
      .catch(() => {});
  };

  useEffect(() => {
    resetState();
    searchBlogs({ page: 1, createNewArray: true });
  }, [query]);
  return (
    <section className="h-cover flex items-center gap-10">
      <div className="w-full">
        <InPageNavigation
          routes={[`search results for "${query}"`, "accounts matched"]}
          defaultHidden={"account matched"}
        />
        <>
          {blogs == null ? (
            <Loader />
          ) : blogs.results.length ? (
            blogs.results.map((blog, index) => {
              return (
                <AnimationWrapper
                  transition={{ duration: 1, delay: index * 0.1 }}
                  key={index}
                  className={"flex gap-4"}
                >
                  <BlogPostCard
                    content={blog}
                    author={blog.author.personal_info}
                  />
                </AnimationWrapper>
              );
            })
          ) : (
            <NoDataMessage message={"No blogs Published."} />
          )}
          <LoadMoreDataButton state={blogs} fetchDataFunction={searchBlogs} />
        </>
      </div>
    </section>
  );
};

export default SearchPage;
