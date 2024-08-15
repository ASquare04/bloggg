import { useContext } from "react"
import AnimateWrap from "../common/page-animation"
import { Link } from "react-router-dom"
import { UserContext } from "../App"
import { removeSession } from "../common/session"

const UserNavigation = () => {

    const { userAuth: {username}, setUserAuth} = useContext(UserContext);

    const signOut = () =>{
        removeSession("user");
        setUserAuth({token : null})
    }

    return(
        <AnimateWrap className="absolute right-0 z-50" transition={{duration:0.2}}>
            <div className="bg-white  right-0 border border-grey w-60 duration-200">
                
                <Link to="/editor" className="flex gap-2 link md:hidden pl-8 py-4">
                <i className="fi fi-rr-file-edit"></i>
                    Write
                </Link>
                <Link to={`/user/${username}`} className="link pl-8 py-4">
                    Profile
                </Link>
                <Link to="/dashboard/blogs" className="link pl-8 py-4">
                    Dashboard
                </Link>
                <Link to="/setting/edit-profile" className="link pl-8 py-4">
                    Settings
                </Link>

                <span className="absolute border-t border-grey w-[100%]"></span>
                <button className="text-left p-4 w-full hover:bg-grey pl-8 py-4"
                onClick={signOut}>
                    <h1 className="font-bold text-xl m-1">Sign Out</h1>
                    <p className="text-dark-grey">@{username}</p>
                </button>

            </div>

        </AnimateWrap>
    )
}

export default UserNavigation
