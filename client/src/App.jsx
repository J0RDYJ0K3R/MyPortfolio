import "./App.css";
import { Routes, Route } from "react-router";
import AdminDashboard from "./pages/AdminDashboard";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Education from "./pages/Education";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import AdminQualifications from "./pages/AdminQualifications";
import AdminContacts from "./pages/AdminContacts";

import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminProjects from "./pages/AdminProjects";

function App() {
  return (
    <div className="app">
      {/* Main navigation displayed on every page */}
      <Navbar />

      {/* Main page content */}
      <main className="main-content">
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
      </main>

      {/* Footer displayed on every page */}
      <Footer />
    </div>
  );
}

export default App;
