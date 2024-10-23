import { useEffect, useRef, useState } from "react";

export let activeTabLineRef;
export let activeTab


const InPageNavigation = ({ routes, defaultHidden = [] , defaultActiveIndex = 0, children }) => {
  activeTabLineRef = useRef();
  activeTab = useRef();

  const [inPageNavIndex, setInPageNavIndex] = useState(defaultActiveIndex);

  const changePageState = (btn, index) => {
    const { offsetWidth, offsetLeft } = btn;


    activeTabLineRef.current.style.width = `${offsetWidth}px`;
    activeTabLineRef.current.style.left = `${offsetLeft}px`;

    setInPageNavIndex(index);
  };

  useEffect(() => {

    const activeButton = activeTab.current;
    if (activeButton) {
      const { offsetWidth, offsetLeft } = activeButton;
      activeTabLineRef.current.style.width = `${offsetWidth}px`;
      activeTabLineRef.current.style.left = `${offsetLeft}px`;
    }
  }, [inPageNavIndex]);

  return (
    <>
    <div className="relative mb-8 bg-white border-b border-grey flex flex-nowrap overflow-x-auto">
      {routes.map((route, index) => (
        <button
          ref={index === inPageNavIndex ? activeTab : null}
          key={index}
          className={
            "p-4 px-5 capitalize font-semibold " +
            (inPageNavIndex === index ? "text-logoGreen " : "text-dark-grey ") + (defaultHidden.includes(route) ? "md:hidden" : " ")}
          onClick={(e) => changePageState(e.target, index)}
        >
          {route}
        </button>
      ))}

      <hr
        ref={activeTabLineRef}
        className="absolute bottom-0 duration-300 ease-in-out transition-all"
      />
    </div>

    { Array.isArray(children) ? children[inPageNavIndex] : children }
    </>
  );
};

export default InPageNavigation;
