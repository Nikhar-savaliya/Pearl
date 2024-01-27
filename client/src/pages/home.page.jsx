import axios from "axios";
import AnimationWrapper from "../common/page-animation";
import InPageNavigation from "../components/inpage-navigation.component";
import React, { useEffect, useState } from "react";
import Loader from "../components/loader.component";
import BlogPostCard from "../components/blog-post.component";
import MinimalBlogPost from "../components/nobanner-blog-post.component";
import { TrendingUp } from "lucide-react";
import { activeTabRef } from "../components/inpage-navigation.component";
import NoDataMessage from "../components/nodata.component";
import { filterPaginationData } from "../common/filter-pagination-data";
import LoadMoreDataButton from "../components/load-more.component";

const Home = () => {
  let [blogs, setBlogs] = useState(null);
  let [trendingBlogs, setTrendingBlogs] = useState(null);
  let [pageState, setPageState] = useState("home");
  let categories = [
    "computer science",
    "tech",
    "travel",
    "cooking",
    "health",
    "ai",
    "social media",
  ];

  const fetchLatestBlogs = ({ page = 1 }) => {
    axios
      .post(import.meta.env.VITE_SERVER_URL + "/latest-blogs", { page })
      .then(async ({ data }) => {
        let formatdata = await filterPaginationData({
          blogState: blogs,
          newData: data.blogs,
          page: page,
          countRoute: "/all-latest-blogs-count",
        });
        setBlogs(formatdata);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const fetchTrendingBlogs = () => {
    axios
      .get(import.meta.env.VITE_SERVER_URL + "/trending-blogs")
      .then(({ data }) => {
        setTrendingBlogs(data.blogs);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const fetchBlogsByCategory = ({ page = 1 }) => {
    axios
      .post(import.meta.env.VITE_SERVER_URL + "/search-blogs", {
        tag: pageState,
        page,
      })
      .then(async ({ data }) => {
        let formatdata = await filterPaginationData({
          blogState: blogs,
          newData: data.blogs,
          page: page,
          countRoute: "/search-blogs-count",
          dataToSend: { tag: pageState },
        });
        setBlogs(formatdata);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const loadBlogByCategory = (e) => {
    let category = e.target.innerText.toLowerCase();

    setBlogs(null);

    if (pageState == category) {
      setPageState("home");
      return;
    }

    setPageState(category);
  };

  useEffect(() => {
    activeTabRef.current.click();
    pageState == "home" && fetchLatestBlogs({ page: 1 });
    pageState != "home" && fetchBlogsByCategory({ page: 1 });
    trendingBlogs == null && fetchTrendingBlogs();
  }, [pageState]);
  return (
    <AnimationWrapper>
      <section className="h-cover flex justify-center gap-10 bg-zinc-50">
        {/* latest Blogs */}
        <div className="w-full">
          <InPageNavigation
            routes={[pageState, "treading blogs"]}
            defaultHidden={["treading blogs"]}
          >
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
              <LoadMoreDataButton
                state={blogs}
                fetchDataFunction={
                  pageState == "home" ? fetchLatestBlogs : fetchBlogsByCategory
                }
              />
            </>
            <div className="md:hidden">
              {trendingBlogs == null ? (
                <Loader />
              ) : trendingBlogs.length ? (
                trendingBlogs.map((blog, index) => {
                  return (
                    <AnimationWrapper
                      transition={{ duration: 1, delay: index * 0.1 }}
                      key={index}
                      className={"flex gap-4"}
                    >
                      <MinimalBlogPost blog={blog} index={index} />
                    </AnimationWrapper>
                  );
                })
              ) : (
                <NoDataMessage message={"No trending blogs found."} />
              )}
            </div>
          </InPageNavigation>
        </div>

        {/* side-section */}
        <div className="min-w-[40%] lg:min-w-[400px] max-w-min border-l pl-8 pt-3 max-md:hidden">
          <div className="flex flex-col gap-10">
            <div>
              <h1 className="font-medium text-xl mb-8 capitalize">
                stories from all interests
              </h1>
              <div className="flex gap-2 flex-wrap">
                {categories.map((category, index) => {
                  return (
                    <button
                      key={index}
                      onClick={loadBlogByCategory}
                      className={`tag ${
                        pageState == category ? "bg-zinc-900 text-zinc-200" : ""
                      } `}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <h1 className="font-medium text-xl pb-4 capitalize flex gap-1">
                trending <TrendingUp width={16} />
              </h1>
              <div className="mt-4">
                {trendingBlogs == null ? (
                  <Loader />
                ) : trendingBlogs.length ? (
                  trendingBlogs.map((blog, index) => {
                    return (
                      <AnimationWrapper
                        transition={{ duration: 1, delay: index * 0.1 }}
                        key={index}
                        className={"flex gap-4"}
                      >
                        <MinimalBlogPost blog={blog} index={index} />
                      </AnimationWrapper>
                    );
                  })
                ) : (
                  <NoDataMessage message={"No trending blogs found."} />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default Home;
