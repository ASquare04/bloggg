import { Link } from "react-router-dom";
import logo from '../imgs/logoo.svg';
import AnimateWrap from "../common/page-animation";
import bannerImg from '../imgs/blog banner.png';
import { uploadImage } from "../common/aws";
import { useContext, useEffect } from "react";
import { Toaster, toast } from 'react-hot-toast';
import { EditorContext } from "../pages/editor.pages";
import EditorJS from "@editorjs/editorjs";
import { tools } from "./tools.component";

const BlogEditor = () => {
    const { blog = { title: '', banner: '', content: '', tags: [], des: '' }, setBlog, textEditor, setTextEditor, setEditorState } = useContext(EditorContext);
     
    // useEffect to initialize EditorJS
    useEffect(() => {
        setTextEditor(new EditorJS({
            holderId: "textEditor",
            data: '', 
            tools: tools,
            placeholder: "Let's write an awesome story",
        }));
    }, [setTextEditor, tools]);

    // Handle image upload
    const handleUpload = async (e) => {
        const img = e.target.files[0];
        if (img) {
            const loadingToast = toast.loading("This may take a while...");
            try {
                const url = await uploadImage(img);
                if (url) {
                    toast.dismiss(loadingToast);
                    toast.success("Cover image uploaded successfully");
                    setBlog({ ...blog, banner: url });
                }
            } catch (err) {
                toast.dismiss(loadingToast);
                toast.error(err.message);
            }
        }
    };

    // Prevent title text area from resizing and update the blog title
    const handleTitleChange = (e) => {
        let input = e.target;
        input.style.height = 'auto';
        input.style.height = input.scrollHeight + 'px';  // Auto-expand textarea height
        setBlog({ ...blog, title: input.value });
    };

    // Error handler for banner image
    const handleError = (e) => {
        let img = e.target;
        img.src = bannerImg;  // Fallback to default banner image
    };

    // Handle publishing the blog
    const handlePublishEvent = () => {
        console.log("Publish button clicked");
        console.log({ banner: blog.banner, title: blog.title, textEditor });

        // Validating required fields
        // if (!blog.banner.length) {
        //     return toast.error("Upload a blog banner before publishing it");
        // }

        if (!blog.title.length) {
            return toast.error("Write a blog title to publish it");
        }

        // Ensure EditorJS is initialized and ready
        if (textEditor && textEditor.isReady) {
            textEditor.save().then(data => {
                console.log("EditorJS saved data:", data);
                if (data.blocks.length) {
                    setBlog({ ...blog, content: data });
                    setEditorState("publish");  // Trigger publish state change
                    toast.success("Blog is ready to be published!");
                } else {
                    return toast.error("Write something in your blog to publish it");
                }
            }).catch((err) => {
                console.error("Error saving content:", err);
                toast.error("Error saving blog content");
            });
        } else {
            toast.error("Editor is not ready yet.");
        }
    };

    return (
        <>
            <nav className="navbar">
                <Link to="/" className="flex-none w-44">
                    <img src={logo} alt="Logo" />
                </Link>
                <p className="max-md:hidden text-black line-clamp-1 w-full">
                    {blog.title.length ? blog.title : "New Blog"}
                </p>
                <div className="flex gap-4 ml-auto">
                    <button className="btn-dark py-2" onClick={handlePublishEvent}>
                        Release
                    </button>
                    <button className="btn-light py-2">
                        Just Draft
                    </button>
                </div>
            </nav>
            <Toaster />
            <AnimateWrap>
                <section>
                    <div className="mx-auto max-w-[800px] w-full">
                        {/* Blog banner upload */}
                        <div className="relative aspect-video bg-white border-2 border-grey hover:opacity-80">
                            <label htmlFor="uploadBanner">
                                <img src={blog.banner} alt="Banner" className="z-20" onError={handleError} />
                                <input id="uploadBanner" type="file" accept=".png,.jpeg,.jpg" hidden onChange={handleUpload} />
                            </label>
                        </div>
                        
                        {/* Blog title input */}
                        <textarea 
                            placeholder="Blog Title"
                            className="text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-40"
                            onChange={handleTitleChange}
                            value={blog.title}
                        />

                        {/* Text Editor for blog content */}
                        <div id="textEditor" className="font-gelasio"></div>
                    </div>
                </section>
            </AnimateWrap>
        </>
    );
};

export default BlogEditor;
