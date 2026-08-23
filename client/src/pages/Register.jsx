import { useState } from "react";
import { supabase } from "../supabaseClient";

import "./Register.css";
function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [message, setMessage] = useState("");
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                },
            },
        });
        if (error) {
            setMessage(`Error: ${error.message}`);
            return;
        }
        setMessage("Registration successful! Please check your email to confirm your account.");
        console.log(data);
    
};
return (
    <div className="register-page">

      <div className="register-container">

        <div className="register-card">

          {/* Logo */}
          <div className="register-logo">
            AI
          </div>

          <h1>Create Account</h1>

          <p className="register-subtitle">
            Create your account and start building
            your career with AI.
          </p>

          {/* Message */}
          {message && (
            <div
              className={
                message.startsWith("Error")
                  ? "register-error"
                  : "register-success"
              }
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Full Name */}
            <div className="register-field">

              <label htmlFor="fullName">
                Full Name
              </label>

              <input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) =>
                  setFullName(e.target.value)
                }
                required
              />

            </div>


            {/* Email */}
            <div className="register-field">

              <label htmlFor="register-email">
                Email
              </label>

              <input
                id="register-email"
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
            <div className="register-field">

              <label htmlFor="register-password">
                Password
              </label>

              <input
                id="register-password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                minLength={6}
                required
              />

              <p className="register-password-hint">
                Password must contain at least 6
                characters.
              </p>

            </div>


            {/* Register */}
            <button
              type="submit"
              className="register-button"
            >
              Create Account
            </button>

          </form>


          {/* Login */}
          <div className="register-footer">

            Already have an account?{" "}

          <a href="/Login"
          className="register-login-link"
          >
            sign in
          </a>
            
         </div>

          </div>

        </div>

      </div>

    
  );
}

export default Register;