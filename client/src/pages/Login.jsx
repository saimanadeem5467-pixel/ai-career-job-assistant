import { useState } from "react";
import {supabase} from "../supabaseClient";
import {useNavigate} from "react-router-dom";
import "./Login.css";
function Login(){
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [message,setMessage]=useState("");
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) {
            setMessage(`Error: ${error.message}`);
            return;
        }
        setMessage("Login successful!");
        console.log("user:",data.user);
        navigate("/dashboard");
    };
    return(
        <div className="login-page">

      <div className="login-container">

        <div className="login-card">

          {/* Logo */}
          <div className="login-logo">
            AI
          </div>

          <h1>Welcome Back</h1>

          <p className="login-subtitle">
            Sign in to continue your AI career journey.
          </p>

          {/* Message */}
          {message && (
            <div
              className={
                message.startsWith("Error")
                  ? "login-error"
                  : "login-success"
              }
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Email */}
            <div className="login-field">

              <label htmlFor="email">
                Email
              </label>

              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
              />

            </div>


            {/* Password */}
            <div className="login-field">

              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />

            </div>


            {/* Login button */}
            <button
              type="submit"
              className="login-button"
            >
              Sign In
            </button>

          </form>


          {/* Register */}
          <div className="login-footer">

            Don't have an account?{" "}

            <button
              type="button"
              className="login-register-link"
              onClick={() =>
                navigate("/register")
              }
            >
              Create an account
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}
    


export default Login;   