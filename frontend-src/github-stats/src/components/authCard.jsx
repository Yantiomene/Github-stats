import { Link } from "react-router-dom";
import React from "react";
import "./authCard.css";

const AuthCard = () => {
  const authType = window.location.pathname;

  if (authType === "/sign-up") {
    return (
      <div className="auth-card">
        <h2>Sign up</h2>

        <form action="/">
          <input type="text" placeholder="username" />
          <input type="text" placeholder="email" />
          <input type="password" placeholder="password" />
          <input type="password" placeholder="confirm password" />

          <input type="submit" className="button-cta" value='sign up'/>
        </form>
        <div className="small-text">
          <small>
            Already have an account? <Link to="/sign-in">Sign in</Link>.
          </small>
          <br />
          <small style={{fontSize: "10px"}}>
            By signing up, you agree to our <Link to="/">Terms</Link> and{" "}
            <Link to="/">Privacy Policy</Link>.
          </small>
        </div>
      </div>
    );
  } else if (authType === "/sign-in") {
    return (
      <div className="auth-card">
        <h2>Sign in</h2>

        <form action="/">
          <input type="text" placeholder="username" />
          <input type="password" placeholder="password" />
          <input type="checkbox" id="remember-me" />
          <label htmlFor="remember-me">Remember me</label>
          <input type="submit" className="button-cta" value='sign in'/>
        </form>
        <div className="small-text">
          <small>
            Do not have an account? <Link to="/sign-up">Sign up</Link> for free.
          </small>
        </div>
      </div>
    );
  }
};

export default AuthCard;
