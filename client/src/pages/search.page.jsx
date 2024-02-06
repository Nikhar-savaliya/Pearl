import { useParams } from "react-router-dom";
import InPageNavigation from "../components/inpage-navigation.component";
import { useEffect, useState } from "react";
import Loader from "../components/loader.component";
import AnimationWrapper from "../common/page-animation";
import NoDataMessage from "../components/nodata.component";
import LoadMoreDataButton from "../components/load-more.component";
import axios from "axios";
import { filterPaginationData } from "../common/filter-pagination-data";
import BlogPostCard from "../components/blog-post.component";
import UserCard from "../components/usercard.component";
import { User } from "lucide-react";

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
          dataToSend: query,
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
    setUsers(null);
  };
  const fetchUsers = () => {
    axios
      .post(import.meta.env.VITE_SERVER_URL + "/search-users", { query })
      .then(({ data: { user } }) => {
        setUsers(user);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    resetState();
    searchBlogs({ page: 1, createNewArray: true });
    fetchUsers();
  }, [query]);

  const UserCardWrapper = () => {
    return (
      <>
        {users == null ? (
          <Loader />
        ) : users.length ? (
          users.map((user, index) => (
            <AnimationWrapper
              key={index}
              transition={{ duration: 1, delay: index * 0.1 }}
            >
              <UserCard user={user} />
            </AnimationWrapper>
          ))
        ) : (
          <NoDataMessage message={"No user found"} />
        )}
      </>
    );
  };

  return (
    <section className="h-cover flex bg-zinc-50 gap-10">
      <div className="w-full">
        <InPageNavigation
          routes={[`search results for "${query}"`, "accounts matched"]}
          defaultHidden={["accounts matched"]}
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
            <LoadMoreDataButton state={blogs} fetchDataFunction={searchBlogs} />
          </>

          <UserCardWrapper />
        </InPageNavigation>
      </div>
      <div className=" min-w[40%] lg:min-w-[350px] max-w-min border-1 border-zinc-200 pl-8 pt-3 max-md:hidden">
        <h1 className="font-medium text-xl mb-8 flex gap-2">
          Users related to search
          <User width={18} />
        </h1>
        <UserCardWrapper />
      </div>
    </section>
  );
};

export default SearchPage;
