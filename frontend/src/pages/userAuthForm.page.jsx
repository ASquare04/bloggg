import InputBox from "../components/input.component"
import google from "../imgs/google.png"
import { Link } from "react-router-dom"
import AnimateWrap from "../common/page-animation"

const UserAuthForm = ({ type }) => {
    return(
        <AnimateWrap keyValue={type}>
        <section className="h-cover flex items-center justify-center">
            <form action="" className="w-[80%] max-w-[400px]">
                <h1 className="text-3xl capitalize text-center mb-24">
                    {type === "sign-in" ? "welcome, we missed you" : "Connect with us"}
                </h1>
                {
                    type != "sign-in" ?
                    <InputBox 
                        name="fullname"
                        type="text"
                        placeholder="Full Name"
                        icon="fi-rr-user" 
                    /> 
                    : ""  
                }
                <InputBox 
                        name="email"
                        type="email"
                        placeholder="Email Address"
                        icon="fi-rr-envelope" 
                    /> 
                <InputBox 
                        name="password"
                        type="password"
                        placeholder="Password"
                        icon="fi-rr-key" 
                    />

                <button className="btn-dark center mt-12" type = "submit">                    
                    {type.replace("-"," ")}
                </button> 

                <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
                    <hr  className="w-1/2 border-black"/>
                    <p>Or</p>
                    <hr  className="w-1/2 border-black"/>
                </div>
                <button className="btn-dark flex items-center justify-center gap-4 center w-[90%]">
                    <img src={google} alt="" className="w-5"/>
                    continue with google
                </button>

                {
                    type === "sign-in" ?
                    <p className="mt-6 text-dark-grey text-xl text-center">
                        Don't have an account?
                        <Link to = "/signup" className="underline text-black text-xl ml-1">
                        Create a new
                        </Link>
                    </p> :
                   
                   <p className="mt-6 text-dark-grey text-xl text-center">
                   Already have an account?
                   <Link to = "/signin" className="underline text-black text-xl ml-1">
                   Sign in
                   </Link>
               </p> 

                }
            </form>

        </section>
        </AnimateWrap>
    )

}

export default UserAuthForm
