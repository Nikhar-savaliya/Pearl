import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import Loader from "../components/loader.component";
import AnimationWrapper from "../common/page-animation";
import { UserContext } from "../App.jsx";
import AboutUser from "../components/about.component.jsx";
import { filterPaginationData } from "../common/filter-pagination-data.jsx";
import BlogPostCard from "../components/blog-post.component.jsx";
import NoDataMessage from "../components/nodata.component.jsx";
import LoadMoreDataButton from "../components/load-more.component.jsx";
import InPageNavigation from "../components/inpage-navigation.component.jsx";
import NotFound from "./NotFound.page.jsx";

export const profilDataStructure = {
  personal_info: {
    username: "",
    fullname: "",
    profile_img: "",
    bio: "",
  },
  account_info: {
    total_reads: "",
    toatl_posts: "",
  },
  social_links: {},
  joinedAt: "",
};

const ProfilePage = () => {
  let [profile, setProfile] = useState(profilDataStructure);
  let [loading, setLoading] = useState(true);
  let [blogs, setBlogs] = useState(null);
  let { id } = useParams();

  let { userAuth } = useContext(UserContext);

  let {
    personal_info: { fullname, username: profile_username, profile_img, bio },
    account_info: { total_reads, total_posts },
    social_links,
    joinedAt,
  } = profile;

  const fetchProfile = () => {
    axios
      .post(import.meta.env.VITE_SERVER_URL + `/get-profile`, {
        username: id,
      })
      .then(({ data: user }) => {
        if (user != null) {
          setProfile(user);
        }
        fetchBlogs({ userId: user._id });
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const fetchBlogs = ({ page = 1, userId }) => {
    userId = userId == undefined ? blogs.userId : userId;
    axios
      .post(import.meta.env.VITE_SERVER_URL + `/search-blogs`, {
        author: userId,
        page,
      })
      .then(async ({ data }) => {
        let formatedData = await filterPaginationData({
          blogState: blogs,
          newData: data.blogs,
          countRoute: "/search-blogs-count",
          dataToSend: { author: userId },
        });
        formatedData.userId = userId;
        setBlogs(formatedData);
      });
  };

  const resetStates = () => {
    setProfile(profilDataStructure);
    setBlogs(null);
    setLoading(true);
  };

  useEffect(() => {
    resetStates();
    fetchProfile();
  }, []);

  return (
    <AnimationWrapper>
      {loading ? (
        <Loader />
      ) : profile_username.length ? (
        <section className="h-cover md:flex flex-row-reverse items-start gap-5 min-[1100px]:gap-12 bg-zinc-50">
          <div className="flex flex-col max-md:items-center gap-5 min-w-[250px] md:w-[50%] md:pl-8 md:border-l border-zinc-200 md:sticky md:top-[100px] md:py-10">
            <img
              src={profile_img}
              className="w-48 h-48 bg-zinc-400 rounded-full md:w-32 md:h-32"
            />
            <h1 className="text-2xl font-md">@{profile_username}</h1>
            <p className="text-xl capitalize h-6">{fullname}</p>
            <p>
              {total_posts.toLocaleString()} Blogs -{" "}
              {total_reads.toLocaleString()} Reads
            </p>
            {id === userAuth?.username ? (
              <div className="flex gap-4 mt-2">
                <Link
                  to="/settings/edit-profile"
                  className="btn-light rounded-xl"
                >
                  Edit Profile
                </Link>
              </div>
            ) : (
              ""
            )}

            <AboutUser
              className={"max-md:hidden"}
              bio={bio}
              social_links={social_links}
              joinedAt={joinedAt}
            />
          </div>
          <div className="max-md:mt-12 w-full">
            <InPageNavigation
              routes={["Blogs", "About"]}
              defaultHidden={["About"]}
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
                  fetchDataFunction={fetchBlogs}
                />
              </>
              <AboutUser
                bio={bio}
                social_links={social_links}
                joinedAt={joinedAt}
              />
            </InPageNavigation>
          </div>
        </section>
      ) : (
        <NotFound />
      )}
    </AnimationWrapper>
  );
};

export default ProfilePage;
