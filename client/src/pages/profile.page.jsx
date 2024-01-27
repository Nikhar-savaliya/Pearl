import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import Loader from "../components/loader.component";
import AnimationWrapper from "../common/page-animation";
import UserContext from "../App.jsx";

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
  let { id } = useParams();

  let { userAuth } = useContext(UserContext);

  let {
    personal_info: { fullname, username: profile_username, profile_img, bio },
    account_info: { total_reads, total_posts },
    social_links: {},
    joinedAt,
  } = profile;

  const fetchProfile = () => {
    axios
      .post(import.meta.env.VITE_SERVER_URL + `/get-profile`, {
        username: id,
      })
      .then(({ data: user }) => {
        setProfile(user);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <AnimationWrapper>
      {loading ? (
        <Loader />
      ) : (
        <section className="h-cover md:flex flex-row-reverse items-start gap-5 min-[1100px]:gap-12">
          <div className="flex flex-col max-md:items-center gap-5 min-w-[250px]">
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
            {/* -----------------48 mins left part 3 ----------- */}
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
          </div>
        </section>
      )}
    </AnimationWrapper>
  );
};

export default ProfilePage;
