
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

const API_URL = "http://localhost:5000";

const emptyForm = {
  title: "",
  completionDate: "",
  description: "",
  technologies: "",
  githubUrl: "",
  liveUrl: "",
  imageUrl: ""
};

function AdminProjects() {
  const navigate = useNavigate();

  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getToken = () => sessionStorage.getItem("token");

  async function loadProjects() {
    const response = await fetch(`${API_URL}/api/projects`);

    if (!response.ok) {
      throw new Error("Unable to load projects");
    }

    const data = await response.json();

    setProjects(Array.isArray(data) ? data : data.projects || []);
  }

  useEffect(() => {
    let active = true;

    async function initialize() {
      const token = getToken();

      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error("Authentication failed");
        }

        const user = await response.json();

        if (user.role !== "admin") {
          throw new Error("Access denied. Administrators only.");
        }

        if (active) {
          setAuthorized(true);
          await loadProjects();
        }
      } catch (err) {
        if (active) {
          setError(err.message);
        }
      } finally {
        if (active) setChecking(false);
      }
    }

    initialize();

    return () => {
      active = false;
    };
  }, [navigate]);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value
    }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  function handleEdit(project) {
    setEditingId(project._id);

    setForm({
      title: project.title || "",
      completionDate: project.completionDate
        ? new Date(project.completionDate).toISOString().split("T")[0]
        : "",
      description: project.description || "",
      technologies: (project.technologies || []).join(", "),
      githubUrl: project.githubUrl || "",
      liveUrl: project.liveUrl || "",
      imageUrl: project.imageUrl || ""
    });

    setError("");
    setSuccess("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!form.title.trim() || !form.description.trim() ||
        !form.completionDate) {
      setError("Please complete all required fields.");
      return;
    }

    setLoading(true);

    const payload = {
      title: form.title.trim(),
      completionDate: form.completionDate,
      description: form.description.trim(),
      technologies: form.technologies
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      githubUrl: form.githubUrl.trim(),
      liveUrl: form.liveUrl.trim(),
      imageUrl: form.imageUrl.trim()
    };

    const isEditing = Boolean(editingId);

    const url = isEditing
      ? `${API_URL}/api/projects/${editingId}`
      : `${API_URL}/api/projects`;

    try {
      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to save project");
      }

      await loadProjects();

      setSuccess(
        isEditing
          ? "Project updated successfully!"
          : "Project created successfully!"
      );

      resetForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(project) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${project.title}"?`
    );

    if (!confirmed) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `${API_URL}/api/projects/${project._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${getToken()}`
          }
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Delete failed");
      }

      await loadProjects();

      if (editingId === project._id) {
        resetForm();
      }

      setSuccess("Project deleted successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (checking) {
    return (
      <section className="admin-dashboard">
        <p>Checking administrator access...</p>
      </section>
    );
  }

  if (!authorized) {
    return (
      <section className="admin-dashboard">
        <h1>Access Denied</h1>
        <p role="alert">{error}</p>
        <Link to="/">Return Home</Link>
      </section>
    );
  }

  return (
    <section className="admin-dashboard">
      <Link to="/admin">← Back to Dashboard</Link>

      <h1>Project Management</h1>
      <p>Create, view, update, and delete portfolio projects.</p>

      {error && <p className="admin-error" role="alert">{error}</p>}
      {success && <p className="admin-success" role="status">{success}</p>}

      <div className="admin-form-card">
        <h2>{editingId ? "Edit Project" : "Add New Project"}</h2>

        <form onSubmit={handleSubmit} className="admin-form">
          <label htmlFor="project-title">Project Title *</label>
          <input
            id="project-title"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />

          <label htmlFor="project-date">Completion Date *</label>
          <input
            id="project-date"
            type="date"
            name="completionDate"
            value={form.completionDate}
            onChange={handleChange}
            required
          />

          <label htmlFor="project-description">Description *</label>
          <textarea
            id="project-description"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="4"
            required
          />

          <label htmlFor="project-technologies">
            Technologies (separate with commas)
          </label>
          <input
            id="project-technologies"
            name="technologies"
            placeholder="React, Express, MongoDB"
            value={form.technologies}
            onChange={handleChange}
          />

          <label htmlFor="project-github">GitHub URL</label>
          <input
            id="project-github"
            type="url"
            name="githubUrl"
            value={form.githubUrl}
            onChange={handleChange}
          />

          <label htmlFor="project-live">Live URL</label>
          <input
            id="project-live"
            type="url"
            name="liveUrl"
            value={form.liveUrl}
            onChange={handleChange}
          />

          <label htmlFor="project-image">Image URL</label>
          <input
            id="project-image"
            type="url"
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
          />

          <div className="admin-actions">
            <button type="submit" disabled={loading}>
              {loading
                ? "Saving..."
                : editingId ? "Update Project" : "Create Project"}
            </button>

            {editingId && (
              <button type="button" onClick={resetForm}>
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      <h2>Existing Projects</h2>

      {projects.length === 0 ? (
        <p>No projects found.</p>
      ) : (
        <div className="admin-grid">
          {projects.map((project) => (
            <article className="admin-card" key={project._id}>
              <h2>{project.title}</h2>
              <p>{project.description}</p>

              <p>
                <strong>Technologies:</strong>{" "}
                {(project.technologies || []).join(", ")}
              </p>

              <p>
                <strong>Completed:</strong>{" "}
                {project.completionDate
                  ? new Date(project.completionDate)
                      .toISOString().split("T")[0]
                  : "Not specified"}
              </p>

              <div className="admin-actions">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleEdit(project)}
                >
                  Edit
                </button>

                <button
                  type="button"
                  className="admin-delete"
                  disabled={loading}
                  onClick={() => handleDelete(project)}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default AdminProjects;
