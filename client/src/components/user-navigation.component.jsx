import AnimationWrapper from "../common/page-animation";
import { Link } from "react-router-dom";
import { FileEdit } from "lucide-react";
import { UserContext } from "../App";
import { useContext } from "react";
import { removeFromSession } from "../common/session";

const UserNavigationPanel = () => {
  // @userContext
  const {
    userAuth: { username },
    setUserAuth,
  } = useContext(UserContext);

  // @handleSignOut
  const signOutUser = () => {
    removeFromSession("user");
    setUserAuth({ access_token: null });
  };

  return (
    <AnimationWrapper
      transition={{ duration: 0.2 }}
      className="absolute right-0 z-50"
    >
      <div className="bg-zinc-50 absolute right-0 top-12 border-zinc-200 w-60 overflow-hidden duration-200">
        <Link to={"/editor"} className="flex gap-2 link md:hidden pl-8 py-4">
          <FileEdit width={18} className="text-zinc-600 pb-0.5" />
          <p className="text-zinc-600">Write</p>
        </Link>

        <Link to={`/user/${username}`} className="link pl-8 py-4">
          profile
        </Link>
        {/* <Link to="dashboard/board" className="link pl-8 py-4">
          dashboard
        </Link>
        <Link to="settings/edit-profile" className="link pl-8 py-4">
          settings
        </Link> */}

        <button
          className="text-left p-4 hover:bg-zinc-200 w-full pl-8 py-4 border-t border-zinc-200"
          onClick={signOutUser}
        >
          <p className="font-bold text-xl mb-1">Sign Out</p>
          <p className="text-zinc-400">@{username}</p>
        </button>
      </div>
    </AnimationWrapper>
  );
};

export default UserNavigationPanel;
