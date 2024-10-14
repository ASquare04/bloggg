import { Link } from "react-router-dom"
import logo from '../imgs/logoo.svg'
import AnimateWrap from "../common/page-animation"
import banner from '../imgs/blog banner.png'

const BlogEditor = () => {

    const handleUpload = (e) => {
        console.log(e)
        let img = e.target.files[0]
    }

    return(
        <>
        <nav className="navbar">
            <Link to="/" className="flex-none w-16">
            <img src={logo}/>
            </Link>
            <p className="max-md:hidden text-black line-clamp-1 w-full">
                New Blog
            </p>
            <div className="flex gap-4 ml-auto">
                <button className="btn-dark py-2">
                    Upload
                </button>
                <button className="btn-light py-2">
                    Draft
                </button>
            </div>
        </nav>

        <AnimateWrap>
            <section>
                <div className="mx-auto max-w-[900px] w-full">
                    <div className="relative aspect-video bg-white border-4 border-grey hover:opacity-80">
                        <label htmlFor="uploadBanner">
                            <img src={banner} alt="" className="z-20" />
                            <input id="uploadBanner" type="file" accept=".png,.jpeg,.jpg" hidden
                            onChange={handleUpload}/>
                        </label>

                    </div>

                </div>
            </section>

        </AnimateWrap>

        </>

    )
}

export default BlogEditor
