import { X } from "lucide-react";
import { EditorContext } from "../pages/editor.pages";
import { useContext } from "react";

const Tag = ({ tag, tagIndex }) => {
  let {
    blog: { tags },
    blog,
    setBlog,
  } = useContext(EditorContext);

  const handleTagDelete = () => {
    tags = tags.filter((t) => t != tag);
    setBlog({ ...blog, tags });
  };

  return (
    <div className="relative p-2 mt-2 mr-2 px-5 bg-emerald-100 hover:bg-opacity-75 rounded-full inline-flex pr-10">
      <p className="outline-none text-emerald-800 text-bold hover:cursor-text">
        {tag}
      </p>
      <button
        onClick={handleTagDelete}
        className="rounded-full absolute right-3 top-1/2 -translate-y-1/2"
      >
        <X width={16} className="text-emerald-800" />
      </button>
    </div>
  );
};

export default Tag;
