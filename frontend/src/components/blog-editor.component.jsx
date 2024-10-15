import { Link } from "react-router-dom"
import logo from '../imgs/logoo.svg'
import AnimateWrap from "../common/page-animation"
import bannerImg from '../imgs/blog banner.png'
import { uploadImage } from "../common/aws"
import { useContext } from "react"
import { Toaster, toast } from 'react-hot-toast'
import { EditorContext } from "../pages/editor.pages"

const BlogEditor = () => {

    let { blog, blog: {title, banner, content, tags, des}, setBlog } = useContext(EditorContext)

    const handleUpload = (e) => {

        let img = e.target.files[0]

        if(img){

            let loadingToast = toast.loading("This may take a while..")

            uploadImage(img).then((url)=>{
                if(url){

                    toast.dismiss(loadingToast)
                    toast.success("Cover image uploaded successfully")

                    setBlog({ ...blog, banner: url });
                }
            })
            .catch(err=>{
                toast.dismiss(loadingToast)
                return toast.error(err)
            })
        }
    }

    const handleTitleKeyDown = (e) =>{
        if(e.keyCode == 13){
            e.preventDefault()
        }
    }

    const handleTitleChange = (e) =>{
        let input = e.target;
        input.style.height = 'auto';
        input.style.height = input.scrollHeight + 'px';

        setBlog({ ...blog, title: input.value })
    }

    const handleError = (e)=>{
        let img = e.target
        img.src = bannerImg
    }
    return(
        <>
        <nav className="navbar">
            <Link to="/" className="flex-none w-44">
            <img src={logo}/>
            </Link>
            <p className="max-md:hidden text-black line-clamp-1 w-full">
                {title.length ? title : ""}
            </p>
            <div className="flex gap-4 ml-auto">
                <button className="btn-dark py-2">
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
                <textarea placeholder="Blog Title" className="text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-40"
                    onKeyDown={handleTitleKeyDown}
                    onChange={handleTitleChange}>
                    </textarea>

                    <div className="relative aspect-video bg-white border-2 border-grey hover:opacity-80">
                        <label htmlFor="uploadBanner">
                            <img src={banner} alt="" className="z-20" onError={handleError} />
                            <input id="uploadBanner" type="file" accept=".png,.jpeg,.jpg" hidden
                            onChange={handleUpload}/>
                        </label>
                    </div>
                    
                    <hr className="w-full opacity-10 my-5" />
                                    
                </div>
            </section>
        </AnimateWrap>

        </>

    )
}

export default BlogEditor
