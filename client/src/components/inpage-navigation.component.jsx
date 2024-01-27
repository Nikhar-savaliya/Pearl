import { useEffect, useRef, useState } from "react";

export let activeTabLineRef;
export let activeTabRef;

const InPageNavigation = ({
  routes,
  defaultHidden = [],
  defaultActiveIndex = 0,
  children,
}) => {
  let [inPageNavIndex, setInPageNavIndex] = useState(defaultActiveIndex);
  activeTabLineRef = useRef();
  activeTabRef = useRef();

  const handleInPageNavigation = (button, index) => {
    let { offsetWidth, offsetLeft } = button;

    activeTabLineRef.current.style.width = offsetWidth + "px";
    activeTabLineRef.current.style.left = offsetLeft + "px";

    setInPageNavIndex(index);
  };

  useEffect(() => {
    handleInPageNavigation(activeTabRef.current, defaultActiveIndex);
  }, []);

  return (
    <>
      <div className="relative mb-8 bg-zinc-50 border-b border-zinc-200 flex flex-nowrap overflow-x-auto">
        {routes.map((item, index) => {
          return (
            <button
              ref={index == defaultActiveIndex ? activeTabRef : null}
              className={`p-4 px-5 capitalize ${
                inPageNavIndex === index ? "text-zinc-900" : "text-zinc-400"
              } ${defaultHidden.includes(item) ? " md:hidden" : ""}`}
              key={index}
              onClick={(e) => handleInPageNavigation(e.target, index)}
            >
              {item}
            </button>
          );
        })}
        <hr
          ref={activeTabLineRef}
          className="absolute bottom-0 border-zinc-900 duration-200"
        />
      </div>
      {Array.isArray(children) ? children[inPageNavIndex] : ""}
    </>
  );
};

export default InPageNavigation;
