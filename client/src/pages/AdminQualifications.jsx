
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

const API_URL = "http://localhost:5000";

const emptyForm = {
  title: "",
  completionDate: "",
  description: ""
};

function AdminQualifications() {
  const navigate = useNavigate();

  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);
  const [qualifications, setQualifications] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getToken = () => sessionStorage.getItem("token");

  async function loadQualifications() {
    const response = await fetch(`${API_URL}/api/qualifications`);

    if (!response.ok) {
      throw new Error("Unable to load qualifications");
    }

    const data = await response.json();
    setQualifications(
      Array.isArray(data) ? data : data.qualifications || []
    );
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
          headers: { Authorization: `Bearer ${token}` }
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
          await loadQualifications();
        }
      } catch (err) {
        if (active) setError(err.message);
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
    setForm({ ...emptyForm });
    setEditingId(null);
  }

  function handleEdit(qualification) {
    setEditingId(qualification._id);

    setForm({
      title: qualification.title || "",
      completionDate: qualification.completionDate
        ? new Date(qualification.completionDate)
            .toISOString().split("T")[0]
        : "",
      description: qualification.description || ""
    });

    setError("");
    setSuccess("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.title.trim() ||
        !form.description.trim() ||
        !form.completionDate) {
      setError("Please complete all required fields.");
      return;
    }

    setLoading(true);

    const isEditing = Boolean(editingId);
    const url = isEditing
      ? `${API_URL}/api/qualifications/${editingId}`
      : `${API_URL}/api/qualifications`;

    try {
      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify({
          title: form.title.trim(),
          completionDate: form.completionDate,
          description: form.description.trim()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to save qualification");
      }

      await loadQualifications();

      setSuccess(
        isEditing
          ? "Qualification updated successfully!"
          : "Qualification created successfully!"
      );

      resetForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(qualification) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${qualification.title}"?`
    );

    if (!confirmed) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `${API_URL}/api/qualifications/${qualification._id}`,
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

      await loadQualifications();

      if (editingId === qualification._id) {
        resetForm();
      }

      setSuccess("Qualification deleted successfully!");
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

      <h1>Qualification Management</h1>
      <p>Create, view, update, and delete qualifications.</p>

      {error && <p className="admin-error" role="alert">{error}</p>}
      {success && <p className="admin-success" role="status">{success}</p>}

      <div className="admin-form-card">
        <h2>
          {editingId ? "Edit Qualification" : "Add New Qualification"}
        </h2>

        <form onSubmit={handleSubmit} className="admin-form">
          <label htmlFor="qualification-title">Title *</label>
          <input
            id="qualification-title"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />

          <label htmlFor="qualification-date">Completion Date *</label>
          <input
            id="qualification-date"
            type="date"
            name="completionDate"
            value={form.completionDate}
            onChange={handleChange}
            required
          />

          <label htmlFor="qualification-description">
            Description *
          </label>
          <textarea
            id="qualification-description"
            name="description"
            rows="4"
            value={form.description}
            onChange={handleChange}
            required
          />

          <div className="admin-actions">
            <button type="submit" disabled={loading}>
              {loading
                ? "Saving..."
                : editingId
                  ? "Update Qualification"
                  : "Create Qualification"}
            </button>

            {editingId && (
              <button type="button" onClick={resetForm}>
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      <h2>Existing Qualifications</h2>

      {qualifications.length === 0 ? (
        <p>No qualifications found.</p>
      ) : (
        <div className="admin-grid">
          {qualifications.map((qualification) => (
            <article
              key={qualification._id}
              className="admin-card"
            >
              <h2>{qualification.title}</h2>
              <p>{qualification.description}</p>

              <p>
                <strong>Completed:</strong>{" "}
                {qualification.completionDate
                  ? new Date(qualification.completionDate)
                      .toISOString().split("T")[0]
                  : "Not specified"}
              </p>

              <div className="admin-actions">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleEdit(qualification)}
                >
                  Edit
                </button>

                <button
                  type="button"
                  className="admin-delete"
                  disabled={loading}
                  onClick={() => handleDelete(qualification)}
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

export default AdminQualifications;
