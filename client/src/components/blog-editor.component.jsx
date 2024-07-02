import { Link, useParams } from "react-router-dom";
import logo from "../assets/pearl.svg";
import defaultBanner from "../imgs/blog banner.png";
import AnimationWrapper from "../common/page-animation";
import { storage } from "../common/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { toast, Toaster } from "react-hot-toast";
import { useContext, useEffect, useState } from "react";
import { EditorContext } from "../pages/editor.pages";
import EditorJS from "@editorjs/editorjs";
import { tools } from "./tools.component";
import { UserContext } from "../App.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BlogEditor = () => {
  const { blogId } = useParams();

  const [selectedFile, setSelectedFile] = useState(null);
  const {} = useContext(UserContext);
  let navigate = useNavigate();
  let {
    userAuth: { access_token },
  } = useContext(UserContext);
  let {
    blog,
    blog: { title, banner, content, tags, description },
    setBlog,
    editorState,
    setEditorState,
    textEditor,
    setTextEditor,
  } = useContext(EditorContext);

  // @EditorJS SETUP
  useEffect(() => {
    if (!textEditor.isReady) {
      setTextEditor(
        new EditorJS({
          holderId: "textEditor",
          data: Array.isArray(content) ? content[0] : content,
          tools: tools,

          placeholder: "Write story here",
        })
      );
    }
  }, []);

  // @FOR BLOG BANNER
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  // @FOR BLOG BANNER
  const handleUpload = () => {
    if (selectedFile) {
      // check for valid file size
      const MAX_FILE_SIZE_MB = 5;
      if (selectedFile.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        toast.error("File size exceeds the limit");
        return;
      }

      const timestamp = new Date().getTime(); // Get a unique timestamp
      const uniqueFileName = `${timestamp}_${selectedFile.name}`;

      const imageRef = ref(storage, uniqueFileName);

      let loader = toast.loading("Uploading...");

      uploadBytes(imageRef, selectedFile)
        .then(() => {
          toast.dismiss(loader);
          toast.success("Image uploaded successfully");
          getDownloadURL(imageRef)
            .then((url) => {
              setBlog({ ...blog, banner: url });
            })
            .catch((error) => {
              console.error("Error getting download URL:", error);
              toast.error("Error getting image URL");
            });
        })
        .catch((error) => {
          console.error("Error uploading image:", error);
          toast.error("Error uploading image");
        });
    } else {
      toast.error("Please select an image to upload");
    }
    setSelectedFile(null);
  };

  //   @FOR BLOG TITLE
  const handleTitleEnterKeyPress = (e) => {
    let element = e.keyCode;
    if (element == 13) {
      e.preventDefault();
    }
  };
  //   @FOR BLOG TITLE
  const handleTitleChange = (e) => {
    let element = e.target;
    setBlog({ ...blog, title: element.value });
    element.style.height = "auto";
    element.style.height = element.scrollHeight + "px";
  };

  // @PUBLISH BLOG
  const handleBlogPublish = () => {
    if (!banner.length) {
      return toast.error("Please Upload Banner!");
    }
    if (!title.length) {
      return toast.error("Please Give Blog Title!");
    }
    if (textEditor.isReady) {
      textEditor
        .save()
        .then((data) => {
          if (data.blocks.length) {
            setBlog({ ...blog, content: data });
            setEditorState("publish");
          } else {
            console.log(data);
            return toast.error("Write something Before Publishing Blog!");
          }
        })
        .catch((err) => console.log(err));
    }
  };

  // @handleSaveDraft
  const handleSaveDraft = (e) => {
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
    let loader = toast.loading("Saving Draft");

    e.target.classList.add("disable");

    if (textEditor.isReady) {
      textEditor.save().then((content) => {
        let blogObj = {
          title,
          banner,
          description,
          tags,
          content,
          draft: true,
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
            toast.success("Blog saved");

            setTimeout(() => {
              navigate("/");
            }, 500);
          })
          .catch(({ response }) => {
            e.target.classList.remove("disable");
            toast.dismiss(loader);
            return toast.error(response.data.error);
          });
      });
    }
  };
  return (
    <>
      <Toaster />
      <nav className="navbar">
        <Link to="/" className="flex-none w-12">
          <img src={logo} />
        </Link>
        <p className="max-md:hidden text-zinc-900 line-clamp-1 w-full">
          {title.length ? title : "New Blog"}
        </p>

        <div className="flex gap-4 ml-auto">
          <button className="btn-dark py-2" onClick={handleBlogPublish}>
            Publish
          </button>
          <button className="btn-light py-2 " onClick={handleSaveDraft}>
            Save Draft
          </button>
        </div>
      </nav>

      <AnimationWrapper>
        <section>
          <div className="mx-auto max-w-[900px] w-full">
            <div className="relative  bg-zinc-50  ">
              <label htmlFor="uploadBanner">
                <img
                  src={banner ? banner : defaultBanner}
                  className="z-20 w-full aspect-video hover:opacity-90"
                />
                <input
                  type="file"
                  id="uploadBanner"
                  accept=".png, .jpg, .jpeg"
                  hidden
                  onChange={handleFileChange}
                />
              </label>
              {selectedFile && (
                <div className="p-4 flex items-center justify-end">
                  <button
                    onClick={handleUpload}
                    className="btn-dark px-5 md:px-8"
                  >
                    Upload
                  </button>
                </div>
              )}
            </div>

            <textarea
              className="text-4xl font-medium mt-4 leading-tight outline-none resize-none w-full h-auto placeholder:opacity-60 "
              placeholder="Blog Title"
              onKeyDown={handleTitleEnterKeyPress}
              defaultValue={title}
              onChange={handleTitleChange}
            ></textarea>
            <div id="textEditor" className="font-gelasio"></div>
          </div>
        </section>
      </AnimationWrapper>
    </>
  );
};

export default BlogEditor;
