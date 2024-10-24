import toast, { Toaster } from "react-hot-toast";
import AnimationWrapper from "../common/page-animation";
import { useContext } from "react";
import { EditorContext } from "../pages/editor.pages";
import axios from "axios";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";

const Tag = ({ tag, tagIndex, removeTag }) => {
  return (
    <span
      key={tagIndex}
      className="inline-block bg-gray-200 text-gray-700 rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2"
    >
      {tag}
      <button onClick={() => removeTag(tagIndex)} className="ml-2 text-red-500">
        &times; {/* Cross sign */}
      </button>
    </span>
  );
};

const PublishForm = () => {
  let characterLimit = 200;
  let tagLimit = 10;

  let {
    blog,
    blog: { banner, title, tags, des, content },
    setEditorState,
    setBlog,
  } = useContext(EditorContext);

  let { userAuth: { token } } = useContext(UserContext)

  let navigate = useNavigate();

  const handleCloseEvent = () => {
    setEditorState("editor");
  };

  const handleBlogTitleChange = (e) => {
    let input = e.target;
    setBlog({ ...blog, title: input.value });
  };

  const handleBlogDesChange = (e) => {
    let input = e.target;
    setBlog({ ...blog, des: input.value });
  };

  const handleTitleKeyDown = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13 || e.keyCode === 188) {
      e.preventDefault();

      let tag = e.target.value.trim(); // Trim whitespace

      if (tags.length < tagLimit) {
        if (!tags.includes(tag) && tag.length) {
          setBlog({ ...blog, tags: [...tags, tag] });
        }
      } else {
        toast.error(`You can add max ${tagLimit} Tags`);
      }
      e.target.value = "";
    }
  };

  // Function to remove a tag by index
  const removeTag = (index) => {
    setBlog({ ...blog, tags: tags.filter((_, i) => i !== index) });
  };



  const publishBlog = (e) => {

    if (e.target.className.includes("disable")) {
      return
    }

    if (!title.length) {
      toast.error('Write a title for blog');
    }

    if (!des.length || des.length > characterLimit) {
      toast.error('Write a short description for blog');
    }
    if (!tags.length) {
      toast.error('Add at least one tag for blog');
    }

    let loadingtoast = toast.loading('Publishing blog...')

    e.target.classList.add('disable')

    let blogObj = {
      title, banner, des, content, tags, draf: false
    }

    axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/create-blog", blogObj, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(() => {

        e.target.classList.remove('disable');

        toast.dismiss(loadingtoast);
        toast.success("Published");

        setTimeout(() => {
          navigate("/")

        }, 1500)

      })
      .catch(({ response }) => {
        e.target.classList.remove('disable');
        toast.dismiss(loadingtoast);

        return toast.error(response.data.error)
      })

  }


  return (
    <AnimationWrapper>
      <section className="w-screen min-h-screen flex items-center justify-center lg:gap-4 py-16">
        <Toaster />

        <button
          className="w-12 h-12 absolute right-[5vw] z-10 top-[5%] lg:top-[10%]"
          onClick={handleCloseEvent}
        >
          <i className="fi fi-br-cross"></i>
        </button>

        <div className="w-full flex flex-col lg:flex-row items-start">
          {/* Left Side: Banner and Title with Description */}
          <div className="flex flex-col w-full lg:w-1/2">
            <p className="text-dark-grey mb-1">Preview</p>

            <div className="w-full aspect-video rounded-lg overflow-hidden bg-grey mt-4">
              {banner ? (
                <img src={banner} alt="Blog banner" />
              ) : (
                <p className="text-center text-dark-grey">
                  No banner image available
                </p>
              )}
            </div>

            <h1 className="text-4xl font-medium mt-2 leading-tight line-clamp-2">
              {title}
            </h1>

            <p className="font-gelasio line-clamp-2 text-xl leading-7 mt-4">
              {des}
            </p>
          </div>

          {/* Right Side: Blog Input Fields */}
          <div className="border-grey lg:border-1 lg:p-4 mt-6 lg:mt-0 lg:ml-4 rounded w-full lg:w-1/2">
            <p className="text-dark-grey mb-2 mt-3">Blog Title</p>
            <input
              type="text"
              placeholder="Blog Title"
              defaultValue={title}
              className="input-box p-4 w-full"
              onChange={handleBlogTitleChange}
            />

            <p className="text-dark-grey mb-2 mt-3">
              Short description about your blog
            </p>
            <textarea
              maxLength={characterLimit}
              defaultValue={des}
              className="h-40 resize-none leading-7 input-box p-4 w-full"
              onChange={handleBlogDesChange}
              onKeyDown={handleTitleKeyDown}
            />

            <p className="mt-1 text-dark-grey text-sm text-right">
              {characterLimit - des.length} characters left
            </p>

            <p className="text-dark-grey mb-2 mt-3">
              Topics - (Helps in searching and ranking your blog post)
            </p>

            <div className="relative input-box p-2 py-2 pb-4">
              <input
                type="text"
                placeholder="Topic"
                className="sticky input-box bg-white top-0 left-0 p-4 mb-3 focus:bg-white w-full"
                onKeyDown={handleKeyDown}
              />

              {tags.map((tag, i) => (
                <Tag tag={tag} tagIndex={i} key={i} removeTag={removeTag} />
              ))}
            </div>
            <p className="mt-1 mb-4 text-dark-grey text-right">
              {tagLimit - tags.length} Tags left
            </p>

            <button className="btn-dark px-8" onClick={publishBlog}>
              Publish
            </button>
          </div>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default PublishForm;
