import { useState, type CSSProperties, type ReactElement } from "react";
import "./ProjectsPage.css";

const thesisImageNames = [
  "process_flow.png",
  "image_nordkrafttriple.png",
  "webapp-login.png",
  "image-welcome.png",
  "webapp-editor.png",
  "image-text.png",
  "image-voice.png",
  "image-inpainting.jpg",
  "image-draganddrop.jpg",
  "image-generated.png",
];

const thesisImages = thesisImageNames.map((name) => `${import.meta.env.BASE_URL}thesis/${name}`);
const thesisPdf = `${import.meta.env.BASE_URL}thesis/OptimizingInputInGenerativeAIPoweredPublicRedesign.pdf`;
const pdfIcon = `${import.meta.env.BASE_URL}pdf.svg`;
const githubIcon = `${import.meta.env.BASE_URL}github.svg`;

type ProjectLinkProps = {
  icon: ReactElement;
  href: string;
  color: string;
  ariaLabel: string;
  download?: boolean;
};

function ProjectLink({ icon, href, color, ariaLabel, download }: ProjectLinkProps) {
  return (
    <a
      className="project-link-card"
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      style={{ color }}
      aria-label={ariaLabel}
      download={download}
    >
      <span className="project-link-icon" style={{ borderColor: color, color }}>
        {icon}
      </span>
    </a>
  );
}

function ImageCarousel({ images }: { images: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const count = images.length;
  const hasMultiple = count > 1;

  if (count === 0) {
    return <div className="image-carousel-empty">No photos available.</div>;
  }

  const prevImage = () => setCurrentIndex((index) => (index - 1 + count) % count);
  const nextImage = () => setCurrentIndex((index) => (index + 1) % count);
  const goToImage = (index: number) => setCurrentIndex(index);

  return (
    <div className="image-carousel">
      <div className="carousel-frame">
        {hasMultiple && (
          <button className="carousel-arrow carousel-arrow-left" onClick={prevImage} aria-label="Previous photo">
            ‹
          </button>
        )}
        <img
          className="carousel-image"
          src={images[currentIndex]}
          alt={`Project photo ${currentIndex + 1} of ${count}`}
        />
        {hasMultiple && (
          <button className="carousel-arrow carousel-arrow-right" onClick={nextImage} aria-label="Next photo">
            ›
          </button>
        )}
      </div>
      {hasMultiple && (
        <div className="carousel-dots">
          {images.map((_, index) => (
            <button
              key={index}
              className={`carousel-dot${index === currentIndex ? " active" : ""}`}
              onClick={() => goToImage(index)}
              aria-label={`Show photo ${index + 1}`}
              type="button"
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ProjectsPage() {
  return (
    <section className="projects-page">
      <div className="projects-container">
        <div className="project-card project-large">
          <div className="project-header-group">
            <div className="project-header">Optimizing Input in Generative AI Powered Public Redesign</div>
            <div className="project-subheader">Thesis project investigating input methods for Image-to-Image editing in public redesign.</div>
          </div>
          <div className="project-content">
            <ImageCarousel images={thesisImages} />
            <div className="project-links">
              <ProjectLink
                icon={<img src={pdfIcon} alt="PDF icon" />}
                href={thesisPdf}
                ariaLabel="Download thesis PDF"
                color="#ec4899"
                download
              />
              <ProjectLink
                //icon={<GitHubIcon />}
                icon={<img src={githubIcon} alt="Github icon" />}
                href="https://github.com/Jumps0/OptimizingInputInGenAIPoweredPublicRedesign"
                ariaLabel="View on GitHub"
                color="#38bdf8"
              />
            </div>
            <div className="project-authors">Authors: Cody Jackson, Farika M.M. Farook, and Ma Shalah</div>
          </div>
          <div className="project-footer">
            <p>
              Over a period of 1 year, our 3 person team researched existing methods of interacting with AI models, identified a specific site to test a future prototype,
              surveyed users in the area for how they would interact with a redesign AI, then designed, implemented, and tested a multi-modal (Text, Voice, Inpainting, Drag & Drop)
              prototype allowing users to take a photo of the space and redesign it in real time utilizing the FLUX family of AI models.
            </p>
            <div className="project-tags">
              <span className="project-tag" style={{ "--tag-color": "#eecd14" } as CSSProperties}>Thesis Project</span>
              <span className="project-tag" style={{ "--tag-color": "#16f962" } as CSSProperties}>Team</span>
              <span className="project-tag" style={{ "--tag-color": "#7c3aed" } as CSSProperties}>Generative AI</span>
              <span className="project-tag" style={{ "--tag-color": "#14b8a6" } as CSSProperties}>UX Research</span>
              <span className="project-tag" style={{ "--tag-color": "#f97316" } as CSSProperties}>System Design</span>
              <span className="project-tag" style={{ "--tag-color": "#38bdf8" } as CSSProperties}>React</span>
            </div>
          </div>
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

        <div className="project-card project-large">
          <div className="project-header">Big Project Title</div>
          <div className="project-content">
            <div className="placeholder">Main content / demo / image</div>
          </div>
          <div className="project-footer">A short descriptive paragraph about the big project. Explain technologies used, role, and outcome.</div>
        </div>
      </div>
    </section>
  );
}

export default ProjectsPage;
