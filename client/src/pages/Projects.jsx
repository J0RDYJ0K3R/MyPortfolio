
import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000";

// Original portfolio projects
const featuredProjects = [
  {
    id: 1,
    title: "Trinity AI Interface",
    image: "/images/project1.jpg",
    technologies: "HTML, CSS, JavaScript, Python",
    description:
      "An interactive artificial intelligence interface designed around a custom visual identity and voice-driven user experience.",
    role:
      "I designed the interface, developed frontend components, and worked on integrating interactive AI features.",
    outcome:
      "The project gave me experience combining frontend development, interface design, APIs, and AI technologies."
  },
  {
    id: 2,
    title: "Object-Oriented Programming Application",
    image: "/images/project2.jpg",
    technologies: "C# / Java",
    description:
      "A programming project created to demonstrate object-oriented programming principles including classes, objects, validation, and application logic.",
    role:
      "I was responsible for designing the classes, implementing the program logic, testing the application, and debugging errors.",
    outcome:
      "The project strengthened my understanding of object-oriented programming and structured application development."
  },
  {
    id: 3,
    title: "Interactive Web Application",
    image: "/images/project3.jpg",
    technologies: "HTML, CSS, JavaScript",
    description:
      "A responsive web application featuring interactive components, structured page layouts, and JavaScript functionality.",
    role:
      "I designed the interface and implemented the application's HTML structure, CSS styling, and JavaScript functionality.",
    outcome:
      "The project improved my understanding of responsive design, DOM manipulation, and frontend web development."
  }
];

function Projects() {
  const [databaseProjects, setDatabaseProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchProjects() {
      try {
        const response = await fetch(
          `${API_URL}/api/projects`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Failed to load projects");
        }

        const data = await response.json();

        setDatabaseProjects(
          Array.isArray(data) ? data : data.projects || []
        );

      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchProjects();

    return () => controller.abort();
  }, []);

  return (
    <section className="page-section">

      <div className="section-heading">
        <p className="eyebrow">My Work!</p>
        <h1>Projects</h1>
        <p>
          Here are several projects that demonstrate my experience
          with software development and web technologies.
        </p>
      </div>

      {/* Original featured projects */}
      <div className="card-grid">
        {featuredProjects.map((project) => (
          <article className="project-card" key={project.id}>
            <img
              src={project.image}
              alt={`${project.title} project`}
            />

            <div className="card-content">
              <h2>{project.title}</h2>

              <p className="technology">
                {project.technologies}
              </p>

              <p>
                <strong>Project:</strong> {project.description}
              </p>

              <p>
                <strong>My Role:</strong> {project.role}
              </p>

              <p>
                <strong>Outcome:</strong> {project.outcome}
              </p>
            </div>
          </article>
        ))}
      </div>

      {/* MongoDB projects retrieved through Express */}
      <div className="section-heading">
        <h2>Projects from Database</h2>
        <p>
          These projects are retrieved dynamically from
          the MongoDB database through the backend API.
        </p>
      </div>

      {loading && <p>Loading projects...</p>}

      {error && (
        <p role="alert">
          Unable to load database projects: {error}
        </p>
      )}

      {!loading && !error && databaseProjects.length === 0 && (
        <p>No database projects available yet.</p>
      )}

      <div className="card-grid">
        {databaseProjects.map((project) => (
          <article className="project-card" key={project._id}>

            {project.imageUrl && (
              <img
                src={project.imageUrl}
                alt={`${project.title} project`}
              />
            )}

            <div className="card-content">
              <h2>{project.title}</h2>

              <p className="technology">
                {(project.technologies || []).join(", ")}
              </p>

              <p>
                <strong>Project:</strong> {project.description}
              </p>

              {project.completionDate && (
                <p>
                  <strong>Completed:</strong>{" "}
                  {new Date(project.completionDate)
                    .toISOString().split("T")[0]}
                </p>
              )}

              {project.githubUrl && (
                <p>
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View GitHub Repository
                  </a>
                </p>
              )}

              {project.liveUrl && (
                <p>
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Live Project
                  </a>
                </p>
              )}
            </div>
          </article>
        ))}
      </div>

    </section>
  );
}

export default Projects;
