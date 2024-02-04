// to display image in blog
const Img = ({ imgUrl, caption }) => {
  return (
    <div>
      <img src={imgUrl} />
      <p className="text-center text-[16px] my-2 text-zinc-500">{caption}</p>
    </div>
  );
};

// to display image in blog
const Quote = ({ data, caption }) => {
  return (
    <div>
      <div className="py-4 bg-zinc-200/50 border-l-4 px-2 border-zinc-600 rounded-[0.2rem]">
        <div className="pl-2 italic">{data}</div>
      </div>
      <p className="text-center text-[16px] my-2 text-zinc-500">{caption}</p>
    </div>
  );
};

// to display list in blog
const List = ({ data, style }) => {
  return (
    <ol
      className={
        style == "ordered"
          ? "list-decimal list-inside"
          : "list-disc list-inside"
      }
    >
      {data.map((item, index) => {
        return <li key={index}>{item}</li>;
      })}
    </ol>
  );
};
const BlogContent = ({ item }) => {
  const { data, type } = item;
  switch (type) {
    case "paragraph":
      return <p dangerouslySetInnerHTML={{ __html: data.text }}></p>;

    case "header":
      return data.level == 2 ? (
        <p
          dangerouslySetInnerHTML={{ __html: data.text }}
          className="text-4xl text-zinc-900"
        ></p>
      ) : (
        <p
          dangerouslySetInnerHTML={{ __html: data.text }}
          className="text-3xl text-zinc-900"
        ></p>
      );

    case "image":
      return <Img caption={data.caption} imgUrl={data.file.url} />;

    case "quote":
      return <Quote caption={data.caption} data={data.text} />;

    case "list":
      return <List data={data.items} style={data.style} />;
    default:
      break;
  }
};
export default BlogContent;
