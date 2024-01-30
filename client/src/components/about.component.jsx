import { Link } from "react-router-dom";
import { getDate } from "../common/date"
const AboutUser = ({ bio, social_links, joinedAt, className }) => {

  return (<div className={"md:w-[90%] md:mt-7 "+className}>
    <p className="text-xl leading-7">
      {
        bio.length ? bio : "No user bio"
      }
    </p>
    <div className="flex gap-x-7 gap-y-2 flex-wrap my-7 items-center text-zinc-400">
      {
        Object.keys(social_links).map((key, index) => {
          let link = social_links[key];
          return link ? <Link to={link} key={index} className="text-[12px]" >{key}</Link> : ""
        })
      }
    </div>
    <p className="leading-7 text-xl text-zinc-600">member since {getDate(joinedAt)}</p>
  </div>)

}

export default AboutUser;
