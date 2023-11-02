import "./header.css";
import Nav from "../components/nav";

const Header = () => {
  return (
    <header>
      <Nav />
      <div className="banner">
        <h1>Get Deeper Insights About A Developer</h1>
        <p>A simple app to view Github user stats</p>
        <span className="cta">
          <a href="/" className="button-cta cta-stroked">
            Learn more
          </a>
          <a href="/sign-up" className="button-cta inv">
            Sign Up
          </a>
        </span>
      </div>
    </header>
  );
};

export default Header;
