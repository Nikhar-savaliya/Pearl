import { ArrowUpLeftSquareIcon } from "lucide-react";
import AnimationWrapper from "../common/page-animation";
import PageNotFound from "../imgs/404.svg";
import { Link } from "react-router-dom";
const NotFound = () => {
  return (
    <AnimationWrapper>
      <section className="h-cover relative flex flex-col item-center gap-10 justify-start text-center">
        <img src={PageNotFound} className="max-w-xs mx-auto" />
        <div className="mb-10">
          <p className="text-3xl mb-6 font-gelasio ">Page Not Found</p>
          <p className="text-md ">
            The page you are looking for does not exist, head back to{" "}
            <Link to={"/"} className="text-emerald-700 underline">
              home page
            </Link>
          </p>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default NotFound;
