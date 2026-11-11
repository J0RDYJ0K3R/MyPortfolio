
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

const API_URL = "http://localhost:5000";

function AdminContacts() {
  const navigate = useNavigate();

  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);
  const [contacts, setContacts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getToken = () => sessionStorage.getItem("token");

  async function loadContacts() {
    const response = await fetch(`${API_URL}/api/contacts`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });

    if (!response.ok) {
      throw new Error("Unable to load contacts");
    }

    const data = await response.json();

    setContacts(
      Array.isArray(data) ? data : data.contacts || []
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
          await loadContacts();
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

  function handleEdit(contact) {
    setEditingId(contact._id);

    setForm({
      firstName: contact.firstName || "",
      lastName: contact.lastName || "",
      name: contact.name || "",
      email: contact.email || "",
      phone: contact.phone || "",
      subject: contact.subject || "",
      message: contact.message || ""
    });

    setError("");
    setSuccess("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value
    }));
  }

  function cancelEdit() {
    setEditingId(null);
    setForm({});
  }

  async function handleUpdate(e) {
    e.preventDefault();

    if (!form.firstName.trim() ||
        !form.lastName.trim() ||
        !form.email.trim() ||
        !form.message.trim()) {
      setError("Please complete all required fields.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `${API_URL}/api/contacts/${editingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`
          },
          body: JSON.stringify(form)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Contact update failed");
      }

      await loadContacts();

      setSuccess("Contact updated successfully!");
      cancelEdit();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(contact) {
    const confirmed = window.confirm(
      `Are you sure you want to delete the message from ${contact.firstName} ${contact.lastName}?`
    );

    if (!confirmed) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `${API_URL}/api/contacts/${contact._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${getToken()}`
          }
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Contact deletion failed");
      }

      await loadContacts();

      if (editingId === contact._id) {
        cancelEdit();
      }

      setSuccess("Contact deleted successfully!");
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

      <h1>Contact Management</h1>
      <p>View, update, and delete submitted contact messages.</p>

      {error && <p className="admin-error" role="alert">{error}</p>}
      {success && <p className="admin-success" role="status">{success}</p>}

      {editingId && (
        <div className="admin-form-card">
          <h2>Edit Contact</h2>

          <form onSubmit={handleUpdate} className="admin-form">
            <label htmlFor="contact-first">First Name *</label>
            <input
              id="contact-first"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              required
            />

            <label htmlFor="contact-last">Last Name *</label>
            <input
              id="contact-last"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              required
            />

            <label htmlFor="contact-email">Email *</label>
            <input
              id="contact-email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />

            <label htmlFor="contact-phone">Phone</label>
            <input
              id="contact-phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />

            <label htmlFor="contact-subject">Subject</label>
            <input
              id="contact-subject"
              name="subject"
              value={form.subject}
              onChange={handleChange}
            />

            <label htmlFor="contact-message">Message *</label>
            <textarea
              id="contact-message"
              name="message"
              rows="5"
              value={form.message}
              onChange={handleChange}
              required
            />

            <div className="admin-actions">
              <button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Update Contact"}
              </button>

              <button type="button" onClick={cancelEdit}>
                Cancel Edit
              </button>
            </div>
          </form>
        </div>
      )}

      <h2>Submitted Contacts</h2>

      {contacts.length === 0 ? (
        <p>No contact submissions found.</p>
      ) : (
        <div className="admin-grid">
          {contacts.map((contact) => (
            <article className="admin-card" key={contact._id}>
              <h2>
                {contact.firstName} {contact.lastName}
              </h2>

              <p><strong>Email:</strong> {contact.email}</p>

              {contact.phone && (
                <p><strong>Phone:</strong> {contact.phone}</p>
              )}

              {contact.subject && (
                <p><strong>Subject:</strong> {contact.subject}</p>
              )}

              <p><strong>Message:</strong> {contact.message}</p>

              <p>
                <strong>Submitted:</strong>{" "}
                {contact.createdAt
                  ? new Date(contact.createdAt).toLocaleString()
                  : "Unknown"}
              </p>

              <div className="admin-actions">
                <button
                  type="button"
                  onClick={() => handleEdit(contact)}
                  disabled={loading}
                >
                  Edit
                </button>

                <button
                  type="button"
                  className="admin-delete"
                  onClick={() => handleDelete(contact)}
                  disabled={loading}
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

export default AdminContacts;
