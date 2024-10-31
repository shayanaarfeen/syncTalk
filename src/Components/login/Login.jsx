import { useState } from "react";
import logo from "../../Images/banner.png";
import { Backdrop, Button, CircularProgress, TextField } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Toaster from "../toast/Toaster.jsx";

const ENDPOINT = import.meta.env.VITE_API_URL;

const Login = () => {
  const [showlogin, setShowlogin] = useState(false);
  const [data, setData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const [loginStatus, setLoginStatus] = useState("");
  const [signInStatus, setSignInStatus] = useState("");

  const navigate = useNavigate();

  const changeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const loginHandler = async () => {
    setLoading(true);

    // console.log(data); //check

    try {
      
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const response = await axios.post(
        ENDPOINT+"/api/user/login/",
        data,
        config
      );

      // console.log("Login : ", response); //check
      setLoginStatus({
        msg: "Sucessfuly Login",
        key: Math.random(),
      });
      localStorage.setItem("userData", JSON.stringify(response));
      navigate("/app/welcome");
      setLoading(false);

    } catch (error) {
      console.error(error);
      
      setLoginStatus({
        msg: "invalid user name or password",
        key: Math.random(),
      })
      setLoading(false);
    }
    
    
  };

  const signUpHandler = async () => {
    setLoading(true)

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const response = await axios.post(
        ENDPOINT+"/api/user/register/",
        data,
        config
      );

      // console.log(response); //check

      setSignInStatus({
        msg: "succesfuly Sign Up",
        key: Math.random(),
      });

      localStorage.setItem("userData", JSON.stringify(response));
      navigate("/app/welcome");
      setLoading(false);


    } catch (error) {
      console.error(error);

      if (error.response.status === 405) {
        setLoginStatus({
          msg: "User with this email ID already exists",
          key: Math.random(),
        });
      }

      if (error.response.status === 406) {
        setLoginStatus({
          msg: "User Name already Taken, please take another one",
          key: Math.random(),
        });
      }
      
      setLoading(false);
    }


  }

  return (
    <>
      
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >

        <CircularProgress color="secondary" />
      </Backdrop>

      <div className="login-container">
        <div className="image-container">
          <img src={logo} alt="Logo" className="welcome-logo" />
        </div>

        {showlogin && (
          <div className="login-box">
            <p className="login-text">Login to your Account</p>

            <TextField
              onChange={changeHandler}
              id="standard-basic-1"
              label="Enter User Name"
              variant="outlined"
              color="secondary"
              name="name"
              onKeyDown={(event) => {
                if (event.code == "Enter") {
                  console.log(event);
                  loginHandler();
                }
              }}
            />
            <TextField
              onChange={changeHandler}
              id="outlined-password-input"
              label="Password"
              type="password"
              autoComplete="current-password"
              color="secondary"
              name="password"
              onKeyDown={(event) => {
                if (event.code == "Enter") {
                  console.log(event);
                  loginHandler();
                }
              }}
            />
            <Button variant="outlined" color="secondary" onClick={loginHandler}>
              Login
            </Button>

            <p>
              Don not have an Account ?{" "}
              <span
                className="hyper"
                onClick={() => {
                  setShowlogin(false);
                }}
              >
                Sign Up
              </span>
            </p>
            {loginStatus ? (<Toaster key={loginStatus.key} message={loginStatus.msg} /> ) : null}
          </div>
        )}

        {!showlogin && (
          <div className="login-box">
            <p className="login-text">Create your Account</p>

            <TextField
              onChange={changeHandler}
              id="standard-basic"
              label="Enter User Name"
              variant="outlined"
              color="secondary"
              name="name"
              helperText=""
              onKeyDown={(event) => {
                if (event.code == "Enter") {
                  console.log(event);
                  signUpHandler();
                }
              }}
            />

            <TextField
              onChange={changeHandler}
              id="standard-basic-2"
              label="Enter Email Address"
              variant="outlined"
              color="secondary"
              name="email"
              onKeyDown={(event) => {
                if (event.code == "Enter") {
                  console.log(event);
                  signUpHandler();
                }
              }}
            />

            <TextField
              onChange={changeHandler}
              id="outlined-password-input"
              label="Password"
              type="password"
              autoComplete="current-password"
              color="secondary"
              name="password"
              onKeyDown={(event) => {
                if (event.code == "Enter") {
                  console.log(event);
                  signUpHandler();
                }
              }}
            />

            <Button
              variant="outlined"
              color="secondary"
              onClick={signUpHandler}
            >
              Sign Up
            </Button>

            <p>
              Already have an Account ?{" "}
              <span
                className="hyper"
                onClick={() => {
                  setShowlogin(true);
                }}
              >
                Log in
              </span>
            </p>
            {signInStatus ? (
              <Toaster key={signInStatus.key} message={signInStatus.msg} />
            ) : null}
          </div>
        )}
      </div>
    </>
  );
};

export default Login;
