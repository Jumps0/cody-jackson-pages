import "./ProjectsPage.css";

function ProjectsPage() {
  return (
    <section className="projects-page">
      <div className="projects-container">
        <div className="project-card project-large">
          <div className="project-header">Big Project Title</div>
          <div className="project-content">
            <div className="placeholder">Main content / demo / image</div>
          </div>
          <div className="project-footer">A short descriptive paragraph about the big project. Explain technologies used, role, and outcome.</div>
        </div>

        <div className="project-pair">
          <div className="project-card project-small">
            <div className="project-header">Small Project 1</div>
            <div className="project-content">
              <div className="placeholder">Content or image</div>
            </div>
            <div className="project-footer">Short description for small project 1.</div>
          </div>

          <div className="project-card project-small">
            <div className="project-header">Small Project 2</div>
            <div className="project-content">
              <div className="placeholder">Content or image</div>
            </div>
            <div className="project-footer">Short description for small project 2.</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProjectsPage;
