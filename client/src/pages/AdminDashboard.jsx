import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

const API_URL = "http://localhost:5000";

function AdminDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function checkAdmin() {
      const token = sessionStorage.getItem("token");

      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error("Unable to verify account");
        }

        const data = await response.json();

        if (data.role !== "admin") {
          setError("Access denied. Administrators only.");
          return;
        }

        setUser(data);
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

    checkAdmin();

    return () => controller.abort();
  }, [navigate]);

  if (loading) {
    return <section className="auth-page">Checking access...</section>;
  }

  if (error) {
    return (
      <section className="auth-page">
        <h1>Access Denied</h1>
        <p role="alert">{error}</p>
        <Link to="/">Return Home</Link>
      </section>
    );
  }

  return (
    <section className="admin-dashboard">
      <h1>Administrator Dashboard</h1>
      <p>Welcome, {user?.name}!</p>

     
    <div className="admin-grid">
    {/* Project Management */}
    <article className="admin-card">
        <h2>Projects</h2>
        <p>Create, update, and delete portfolio projects.</p>

        <Link to="/admin/projects" className="admin-card-link">
        Manage Projects
        </Link>
    </article>

    {/* Qualification Management */}
    <article className="admin-card">
        <h2>Qualifications</h2>
        <p>Manage education and qualifications.</p>

        <Link
        to="/admin/qualifications"
        className="admin-card-link"
        >
        Manage Qualifications
        </Link>
    </article>

    {/* Contact Management */}
    
    <article className="admin-card">
        <h2>Contacts</h2>
        <p>View and manage submitted contact messages.</p>

        <Link to="/admin/contacts" className="admin-card-link">
            Manage Contacts
        </Link>
    </article>

    </div>

    </section>
  );
}

export default AdminDashboard;
