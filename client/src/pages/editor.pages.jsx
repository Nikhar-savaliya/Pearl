import { useContext, useState, createContext, useEffect } from "react";
import { UserContext } from "../App.jsx";
import { Navigate, useParams } from "react-router-dom";
import BlogEditor from "../components/blog-editor.component";
import PublishForm from "../components/publish-form.component";
import Loader from "../components/loader.component.jsx";
import axios from "axios";

const blogStructure = {
  title: "",
  banner: "",
  content: [],
  tags: [],
  description: "",
  author: {
    personal_info: {},
  },
};

export const EditorContext = createContext({});

const EditorPage = () => {
  const { blogId } = useParams();

  const [blog, setBlog] = useState(blogStructure);
  const [editorState, setEditorState] = useState("editor");
  const [textEditor, setTextEditor] = useState({ isReady: false });
  const [loading, setLoading] = useState(true);
  let {
    userAuth: { access_token },
  } = useContext(UserContext);

  useEffect(() => {
    if (blogId) {
      axios
        .post(import.meta.env.VITE_SERVER_URL + "/get-blog", {
          blogId,
          draft: true,
          mode: "edit",
        })
        .then(({ data: { blog } }) => {
          setBlog(blog);
          setLoading(false);
        })
        .catch((err) => {
          setBlog(blogStructure);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  // console.log(blog);
  return (
    <EditorContext.Provider
      value={{
        blog,
        setBlog,
        editorState,
        setEditorState,
        textEditor,
        setTextEditor,
      }}
    >
      {access_token === null ? (
        <Navigate to={"/signin"} />
      ) : loading ? (
        <Loader />
      ) : editorState == "editor" ? (
        <BlogEditor />
      ) : (
        <PublishForm />
      )}
    </EditorContext.Provider>
  );
};

export default EditorPage;
