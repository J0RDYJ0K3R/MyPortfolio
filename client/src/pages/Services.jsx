const services = [
  {
    id: 1,
    icon: "💻",
    title: "Web Development",
    description:
      "Development of responsive websites and web interfaces using HTML, CSS, JavaScript, and React."
  },
  {
    id: 2,
    icon: "⌨️",
    title: "Programming",
    description:
      "Development of software applications using programming languages such as Java, C#, Python, and JavaScript."
  },
  {
    id: 3,
    icon: "🗄️",
    title: "Database Development",
    description:
      "Design and implementation of relational databases using SQL and database management concepts."
  },
  {
    id: 4,
    icon: "🤖",
    title: "AI Development",
    description:
      "Exploration and development of artificial intelligence applications and intelligent software systems."
  }
];

function Services() {
  return (
    <section className="page-section">

      <div className="section-heading">
        <p className="eyebrow">What I Do!</p>
        <h1>Services</h1>

        <p>
          These are some of the technical areas in which I can provide
          development assistance.
        </p>
      </div>

      <div className="service-grid">

        {services.map((service) => (
          <article className="service-card" key={service.id}>

            <div className="service-icon">
              {service.icon}
            </div>

            <h2>{service.title}</h2>

            <p>{service.description}</p>

          </article>
        ))}

      </div>

    </section>
  );
}

export default Services;