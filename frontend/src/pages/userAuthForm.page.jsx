import InputBox from "../components/input.component";
import google from "../imgs/google.png";
import cover1 from "../imgs/cover.svg"; // Cover image for sign-in
import cover2 from "../imgs/cover2.svg"; // Cover image for sign-up
import { Link, Navigate } from "react-router-dom";
import AnimateWrap from "../common/page-animation";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import { storeInSession } from "../common/session";
import { useContext } from "react";
import { UserContext } from "../App";

const UserAuthForm = ({ type }) => {
    let { userAuth: { token }, setUserAuth } = useContext(UserContext);
    console.log(token);

    const userAuthViaServer = (serverRoute, formData) => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData)
            .then(({ data }) => {
                storeInSession("user", JSON.stringify(data));
                setUserAuth(data);
            })
            .catch(({ response }) => {
                toast.error(response.data.error);
            });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        let serverRoute = type === "sign-in" ? "/signin" : "/signup";

        let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
        let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,15}$/; // regex for password

        let form = new FormData(formStructure);
        let formData = {};

        for (let [key, value] of form.entries()) {
            formData[key] = value;
        }

        let { fullname, email, password } = formData;
        if (fullname) {
            if (fullname.length < 3) {
                return toast.error("Full Name must consist of at least 3 letters");
            }
        }

        if (!email.length) {
            return toast.error("Enter the email");
        }
        if (!emailRegex.test(email)) {
            return toast.error("Provide a valid email address");
        }
        if (!passwordRegex.test(password)) {
            return toast.error("Password must be 6-15 characters, with uppercase, lowercase, and a number.");
        }

        userAuthViaServer(serverRoute, formData);
    };

    // Determine which cover image to use based on the type
    const coverImage = type === "sign-in" ? cover1 : cover2;

    return (
        token ? (
            <Navigate to="/" />
        ) : (
            <AnimateWrap keyValue={type}>
                <section className="h-cover flex flex-col md:flex-row items-center justify-between">
                    <div className="w-2/3 md:w-auto">
                        <img src={coverImage} alt="" className="" />
                    </div>
                    <Toaster />
                    <form id="formStructure" className="w-2/3 max-w-[400px]">
                        <h1 className="text-3xl capitalize text-center mb-24">
                            {type === "sign-in" ? "welcome, we missed you" : "Connect with us"}
                        </h1>
                        {
                            type !== "sign-in" ? (
                                <InputBox
                                    name="fullname"
                                    type="text"
                                    placeholder="Full Name"
                                    icon="fi-rr-user"
                                />
                            ) : ""
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

                        <button className="btn-dark center mt-12" type="submit"
                            onClick={handleSubmit}>
                            {type.replace("-", " ")}
                        </button>

                        <div className="relative w-full flex items-center gap-2 my-10 opacity-20 uppercase text-black font-bold">
                            <hr className="w-1/2 border-black" />
                            <p>Or</p>
                            <hr className="w-1/2 border-black" />
                        </div>
                        <button className="btn-light flex items-center justify-center gap-4 center w-[90%]">
                            <img src={google} alt="" className="w-5" />
                            continue with google
                        </button>

                        {
                            type === "sign-in" ? (
                                <p className="mt-6 text-dark-grey text-xl text-center">
                                    Don't have an account?
                                    <Link to="/signup" className="underline text-black font-medium text-xl ml-1">
                                        Create a new
                                    </Link>
                                </p>
                            ) : (
                                <p className="mt-6 text-dark-grey text-xl text-center">
                                    Already have an account?
                                    <Link to="/signin" className="underline text-black font-medium text-xl ml-1">
                                        Sign in
                                    </Link>
                                </p>
                            )
                        }
                    </form>
                </section>
            </AnimateWrap>
        )
    );
}

export default UserAuthForm;
 