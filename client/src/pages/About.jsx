function About() {
  return (
    <section className="page-section">

      <div className="section-heading">
        <p className="eyebrow">Get To Know Me</p>
        <h1>About Me!</h1>
      </div>

      <div className="about-container">

        <div className="about-image">
          <img
            src="/images/profile.jpg"
            alt="Professional portrait of Benjamin Shlamovsky-Koroz"
          />
        </div>

        <div className="about-content">

          <h2>Benjamin Shlamovsky-Koroz</h2>

          <p>
            I am currently studying Software Engineering Technology with a
            focus on Artificial Intelligence. I enjoy learning how software
            systems work and developing applications that solve practical
            problems.
          </p>

          <p>
            My areas of interest include web development, programming,
            artificial intelligence, databases, and software design. I am
            continuing to improve my technical abilities through academic
            projects and independent development.
          </p>

          <p>
            My goal is to continue developing my skills and gain professional
            experience in the software development industry.
          </p>

          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="primary-button"
          >
            View My Resume
          </a>

        </div>

      </div>

    </section>
  );
}

export default About;