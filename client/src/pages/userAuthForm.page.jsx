import axios from "axios";
import { useContext } from "react";
import { storeInSession } from "../common/session";
import { authWithGoogle } from "../common/firebase.jsx";
import { User, Mail, KeyRound } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import AnimationWrapper from "../common/page-animation";
import InputBox from "../components/input.component";
import GoogleIcon from "../imgs/google.png";
import { UserContext } from "../App";

const UserAuthForm = ({ type }) => {
  
  let {
    userAuth: { access_token },
    setUserAuth,
  } = useContext(UserContext);

  // console.log(access_token);


  // ----- Authenticate user From server -----
  const userAuthFromServer = async (serverRoute, formData) => {
    try {
      const response = await axios.post(import.meta.env.VITE_SERVER_URL + serverRoute, formData);
      const data = response.data;
      
      // console.log(data);
      storeInSession("user", JSON.stringify(data));
      setUserAuth(data);
    } catch (error) {
      console.error("Error in userAuthFromServer:", error);
      toast.error(error.response?.data?.error || "Internal Server Error");
    }
  };
  

  // ----- handle form submit -----
  const handleSubmit = (e) => {
    e.preventDefault();

    // @Formdata
    let form = new FormData(formElement);
    let formData = {};

    for (let [key, value] of form.entries()) {
      formData[key] = value;
    }

    let { fullname, email, password } = formData;

    // validating data from frontend
    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
    let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

    if (fullname) {
      if (fullname.length < 3) {
        return toast.error("Full name must be at least 3 letters long");
      }
    }
    if (!email.length) {
      return toast.error("Email required");
    }
    if (!emailRegex.test(email)) {
      return toast.error("Invalid Email");
    }
    if (!passwordRegex.test(password)) {
      return toast.error(
        "password must be 6 to 20 characters long with a numeric, 1 lowervcase and 1 uppercase letters."
      );
    }
    let serverRoute = type === "sign-in" ? "/signin" : "/signup";
    userAuthFromServer(serverRoute, formData);
  };

  // ------- Authenticate User from Google ----
  const handleGoogleAuth = (e) => {
    e.preventDefault();

    authWithGoogle().then((user) => {
        let serverRoute = "/google-auth";
        let formData = {
          access_token: user.accessToken,
        };
        userAuthFromServer(serverRoute, formData);
    })
      .catch((error) => toast.error("Troble login through google"));
  };

  return access_token ?(
    <Navigate to={"/"} />
  ): (
    <AnimationWrapper keyValue={type}>
      <section className="h-cover flex items-center justify-center bg-zinc-50">
        <Toaster />
        <form
          id="formElement"
          action=""
          className="w-[80%] mx-auto max-w-[400px]"
          onSubmit={handleSubmit}
        >
          <h1 className="text-4xl font-gelasio capitalize mb-24 text-center font-bold">
            {type == "sign-in" ? "welcome back" : "join us today"}
          </h1>
          {type !== "sign-in" ? (
            <InputBox
              name={"fullname"}
              type={"text"}
              placeholder={"Full name"}
              Icon={User}
            />
          ) : (
            ""
          )}
          <InputBox
            name={"email"}
            type={"email"}
            placeholder={"Email"}
            Icon={Mail}
          />
          <InputBox
            name={"password"}
            type={"password"}
            placeholder={"password"}
            Icon={KeyRound}
          />

          <button
            className="btn-dark center mt-14 px-8 w-[40%] text-center"
            type="submit"
          >
            {type.replace("-", " ")}
          </button>

          <div className="relative w-full flex items-center gap-2 my-10   uppercase text-zinc-400 font-medium select-none">
            <hr className="w-1/2 border-zinc-300" />
            <p className="">or</p>
            <hr className="w-1/2 border-zinc-300" />
          </div>

          <button
            className="btn-dark center flex items-center justify-center gap-4 w-4/5"
            onClick={handleGoogleAuth}
          >
            <img src={GoogleIcon} className="w-5" />
            continue with google
          </button>
          {type === "sign-in" ? (
            <p className="mt-6 text-zinc-600 text-center">
              Don't have an account?
              <Link to={"/signup"} className="text-zinc-800 underline  ml-1">
                Sign Up
              </Link>
            </p>
          ) : (
            <p className="mt-6 text-zinc-600 text-center">
              already a member?
              <Link to={"/signin"} className="text-zinc-800 underline  ml-2">
                Sign In
              </Link>
            </p>
          )}
        </form>
      </section>
    </AnimationWrapper>
  );
};
export default UserAuthForm;
