import { Link } from "react-router";

function Home() {
  return (
    <section className="hero">
      <div className="hero-content">

        <p className="eyebrow">Software Engineering Technology Student</p>

        <h1>
          Hello, I'm <span>Benjamin Shlamovsky-Koroz</span>
        </h1>

        <h2>Developer • Student • Problem Solver</h2>

        <p className="hero-description">
          Welcome to my personal portfolio. I am a software development
          student focused on creating reliable, practical, and user-friendly
          applications while continuously expanding my knowledge of modern
          technologies.
        </p>

        <div className="hero-buttons">
          <Link to="/about" className="primary-button">
            About Me!
          </Link>

          <Link to="/projects" className="secondary-button">
            View My Projects
          </Link>
        </div>

      </div>
    </section>
  );
}

export default Home;