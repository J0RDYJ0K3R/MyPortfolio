
import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000";

function Education() {
  const [qualifications, setQualifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchQualifications() {
      try {
        const response = await fetch(
          `${API_URL}/api/qualifications`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Failed to load qualifications");
        }

        const data = await response.json();

        setQualifications(
          Array.isArray(data)
            ? data
            : data.qualifications || []
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

    fetchQualifications();

    return () => controller.abort();
  }, []);

  return (
    <section className="page-section">

      <div className="section-heading">
        <p className="eyebrow">Academic Background!</p>
        <h1>Education</h1>
      </div>

      {/* Existing education records */}
      <div className="timeline">

        <article className="education-card">
          <span className="education-date">
            2025 - Present
          </span>

          <h2>Centennial College</h2>

          <h3>
            Software Engineering Technology – Artificial Intelligence
          </h3>

          <p>Advanced Diploma Program</p>

          <p>
            Coursework includes software development, web application
            development, object-oriented programming, databases,
            artificial intelligence, mathematics, and software engineering.
          </p>
        </article>

        <article className="education-card">
          <span className="education-date">
            2013 – 2017
          </span>

          <h2>West Carleton High School</h2>

          <h3>Ontario Secondary School Diploma</h3>

          <p>Ottawa, Ontario</p>
        </article>

      </div>

      {/* Qualifications retrieved from MongoDB */}
      <div className="section-heading">
        <h2>Qualifications from Database</h2>
        <p>
          These qualifications are retrieved dynamically
          from MongoDB through the Express API.
        </p>
      </div>

      {loading && <p>Loading qualifications...</p>}

      {error && (
        <p role="alert">
          Unable to load qualifications: {error}
        </p>
      )}

      {!loading && !error && qualifications.length === 0 && (
        <p>No additional qualifications available yet.</p>
      )}

      <div className="timeline">
        {qualifications.map((qualification) => (
          <article
            className="education-card"
            key={qualification._id}
          >
            <span className="education-date">
              {qualification.completionDate
                ? new Date(qualification.completionDate)
                    .toISOString().split("T")[0]
                : "Date unavailable"}
            </span>

            <h2>{qualification.title}</h2>

            <p>{qualification.description}</p>
          </article>
        ))}
      </div>

    </section>
  );
}

export default Education;
