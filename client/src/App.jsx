
import "./App.css";
import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";

// Load additional pages only when required
const About = lazy(() => import("./pages/About"));
const Projects = lazy(() => import("./pages/Projects"));
const Education = lazy(() => import("./pages/Education"));
const Services = lazy(() => import("./pages/Services"));
const Contact = lazy(() => import("./pages/Contact"));

const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminProjects = lazy(() => import("./pages/AdminProjects"));
const AdminQualifications = lazy(() => import("./pages/AdminQualifications"));
const AdminContacts = lazy(() => import("./pages/AdminContacts"));

const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));

function App() {
  return (
    <div className="app">
      {/* Main navigation displayed on every page */}
      <Navbar />

      {/* Main page content */}
      <main className="main-content">
        <Suspense fallback={<p role="status">Loading page...</p>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/education" element={<Education />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/projects" element={<AdminProjects />} />
            <Route
              path="/admin/qualifications"
              element={<AdminQualifications />}
            />
            <Route path="/admin/contacts" element={<AdminContacts />} />

            {/* Authentication pages */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </Suspense>
      </main>

      {/* Footer displayed on every page */}
      <Footer />
    </div>
  );
}

export default App;
