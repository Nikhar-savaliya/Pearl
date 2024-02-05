import { X } from "lucide-react";
import AnimationWrapper from "../common/page-animation";
import { useContext } from "react";
import { UserContext } from "../App";
import { EditorContext } from "../pages/editor.pages";
import { toast, Toaster } from "react-hot-toast";
import Tag from "./tags.component";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const PublishForm = () => {
  let maxCharacterLimit = 200;
  let maxTagsLimit = 10;

  const { blogId } = useParams();

  let navigate = useNavigate();
  let {
    userAuth: { access_token },
  } = useContext(UserContext);
  let {
    blog: { banner, title, description, tags, content },
    blog,
    setBlog,
    setEditorState,
  } = useContext(EditorContext);

  // @handleCloseFinctionality
  const handleCloseFunctionality = () => {
    setEditorState("editor");
  };
  // @handlePublishBlog
  const handlePublishBlog = (e) => {
    if (e.target.className.includes("disable")) {
      return;
    }
    if (!title.length) {
      return toast.error("Please provide the Title");
    }
    if (!description.length) {
      return toast.error("Please provide the Description");
    }
    if (!tags.length) {
      return toast.error("Please provide the atleast one tag");
    }
    let loader = toast.loading("Publishing");

    e.target.classList.add("disable");

    let blogObj = {
      title,
      banner,
      description,
      tags,
      content,
      darft: false,
    };
    axios
      .post(
        import.meta.env.VITE_SERVER_URL + "/create-blog",
        { ...blogObj, blogId },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      )
      .then((res) => {
        console.log(res);
        e.target.classList.remove("disable");
        toast.dismiss(loader);
        toast.success("Blog published");

        setTimeout(() => {
          navigate("/");
        }, 500);
      })
      .catch(({ response }) => {
        e.target.classList.remove("disable");
        toast.dismiss(loader);
        return toast.error(response.data.error);
      });
  };
  return (
    <AnimationWrapper>
      <Toaster />
      <section className="w-screen min-h-screen grid items-center justify-start lg:grid-cols-2 py-16 lg:gap-4">
        <button
          className="w-12 h-12 z-50 absolute right-[5vw] top-12 lg:top-[5%]"
          onClick={handleCloseFunctionality}
        >
          <X className="hover:bg-zinc-200 p-[2px] rounded-full" />
        </button>

        <div className=" max-w-xl center md:self-start">
          <p className="text-zinc-600 mb-2 text-xl">preview</p>
          <div className="w-full aspect-video md:h-auto overflow-hidden mt-3">
            <img src={banner} />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-medium mt-2 leading-tight line-clamp-2">
              {title}
            </h1>
            <p className="font-gelasio line-clamp-2 text-xl leading-7 mt-4">
              {description}
            </p>
          </div>
        </div>
        <div className="border-zinc-200 lg:border-1 lg:pl-1">
          <p className="text-zinc-800 mb-2 mt-9 md">Blog Title</p>
          <input
            type="text"
            placeholder="Blog Title"
            defaultValue={title}
            onChange={(e) => setBlog({ ...blog, title: e.target.value })}
            className="input-box rounded-xl pl-4"
          />
          <p className="text-zinc-800 mb-2 mt-9">
            Short Description about blog
          </p>
          <textarea
            maxLength={maxCharacterLimit}
            defaultValue={description}
            className="h-40 resize-none leading-7 input-box pl-4 rounded-xl"
            onChange={(e) => setBlog({ ...blog, description: e.target.value })}
            onKeyDown={(e) => e.keyCode == 13 && e.preventDefault()}
          />
          <p className="text-zinc-400 text-sm pr-1 text-right">
            {maxCharacterLimit - description.length} Characters left
          </p>
          <div className="my-4">
            <p className="mb-2">
              Topics - ( helps in searching and ranking your blog post)
            </p>

            <div className="relative input-box pl-2 py-2 pb-4">
              <input
                type="text"
                placeholder="Keyword"
                className="sticky input-box bg-zinc-50 top-0 left-0 pl-4 mb-4 ml-1"
                onKeyDown={(e) => {
                  let tag = e.target.value;
                  if (e.keyCode === 13 || e.keyCode === 188) {
                    e.preventDefault();
                    if (tags.length < maxTagsLimit) {
                      if (!tags.includes(tag) && tag.length) {
                        setBlog({ ...blog, tags: [...tags, tag] });
                      }
                    } else {
                      toast.error(`you can only ${maxTagsLimit} tags`);
                    }
                    e.target.value = "";
                  }
                }}
              />
              {tags.map((tag, i) => {
                return <Tag tag={tag} tagIndex={i} key={tag} />;
              })}
            </div>
            <p className="mt-2 mb-4 text-zinc-400 text-right text-sm mr-1">
              {maxTagsLimit - tags.length} tags left
            </p>
            <button className="btn-dark px-8" onClick={handlePublishBlog}>
              Publish
            </button>
          </div>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default PublishForm;
