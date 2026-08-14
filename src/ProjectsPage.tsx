import { useState, type CSSProperties, type ReactElement } from "react";
import "./ProjectsPage.css";
import { useLanguage } from './LanguageProvider';

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

const badgerInfoImageNames = [
  "img_welcomepage.png",
  "img_notifier.png",
  "img_popup1.png",
  "img_popup2.png",
  "img_popup3.png",
  "img_detailcontrol (1).png",
  "img_detailcontrol (2).png",
  "img_internalpage1.png",
  "internalpage_visual1.png",
  "internalpage_visual1HOVER.png",
  "internalpage_visual2.png",
  "internalpage_visual2HOVER.png",
];
const badgerInfoImages = badgerInfoImageNames.map((name) => `${import.meta.env.BASE_URL}badgerinfo++/${name}`);

const dndCommandImage = `${import.meta.env.BASE_URL}dnd-command.png`;
const cogworldImage = `${import.meta.env.BASE_URL}cogworld.png`;
const bigdataImage = `${import.meta.env.BASE_URL}big-data.png`;
const showcaseVideo = `${import.meta.env.BASE_URL}showcase-video.mp4`;

const thesisPdf = `${import.meta.env.BASE_URL}thesis/OptimizingInputInGenerativeAIPoweredPublicRedesign.pdf`;
const badgerInfoPdf = `${import.meta.env.BASE_URL}badgerinfo++/BadgerInfo++.A.Layered-Explanation.Extension.for.Web-Tracking.Transparency.pdf`;
const pdfIcon = `${import.meta.env.BASE_URL}pdf.svg`;
const githubIcon = `${import.meta.env.BASE_URL}github.svg`;
const unityIcon = `${import.meta.env.BASE_URL}unity.svg`;

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

  const { t } = useLanguage();

  if (count === 0) {
    return <div className="image-carousel-empty">{t({ en: 'No photos available.', dk: 'Ingen billeder tilgængelige.' })}</div>;
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

function YouTubeVideo({ videoUrl }: { videoUrl: string }) {
  const getEmbedUrl = (url: string) => {
    try {
      const parsedUrl = new URL(url);
      const host = parsedUrl.hostname.replace(/^www\./, "");

      if (host === "youtu.be") {
        const videoId = parsedUrl.pathname.replace("/", "").split("/")[0];
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
      }

      if (host === "youtube.com" || host === "m.youtube.com") {
        const videoId =
          parsedUrl.searchParams.get("v") ??
          parsedUrl.pathname.split("/").filter(Boolean).find((segment) => segment === "embed" || segment === "shorts" || segment === "live")
            ? parsedUrl.pathname.split("/").filter(Boolean).at(-1) ?? null
            : null;

        if (videoId && parsedUrl.pathname.includes("/embed/")) {
          return `https://www.youtube.com/embed/${videoId}`;
        }

        if (videoId && parsedUrl.searchParams.get("v")) {
          return `https://www.youtube.com/embed/${parsedUrl.searchParams.get("v")}`;
        }

        if (parsedUrl.pathname.includes("/shorts/")) {
          const shortsId = parsedUrl.pathname.split("/shorts/")[1]?.split("/")[0];
          return shortsId ? `https://www.youtube.com/embed/${shortsId}` : null;
        }

        if (parsedUrl.pathname.includes("/live/")) {
          const liveId = parsedUrl.pathname.split("/live/")[1]?.split("/")[0];
          return liveId ? `https://www.youtube.com/embed/${liveId}` : null;
        }
      }

      return null;
    } catch {
      return null;
    }
  };

  const embedUrl = getEmbedUrl(videoUrl);

  if (!embedUrl) {
    return <div className="youtube-video-error">Please provide a valid YouTube URL.</div>;
  }

  return (
    <div className="youtube-video-wrapper">
      <iframe
        className="youtube-video"
        src={embedUrl}
        title="YouTube video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
}

function VideoPlayer({ src, poster, ariaLabel }: { src: string; poster?: string; ariaLabel?: string }) {
  return (
    <div className="video-wrapper">
      <video
        className="project-media-video"
        src={src}
        controls
        preload="metadata"
        poster={poster}
        aria-label={ariaLabel}
        playsInline
      />
    </div>
  );
}

function ProjectsPage() {
  const { t } = useLanguage();
  return (
    <section className="projects-page">
      <div className="projects-container">
        <div className="project-card project-large">
          <div className="project-header-group">
            <div className="project-header">{t({ en: 'Optimizing Input in Generative AI Powered Public Redesign', dk: 'Optimering af input i generativ AI-drevet offentlig redesign' })}</div>
            <div className="project-subheader">{t({ en: 'Thesis project investigating input methods for Image-to-Image editing in public redesign.', dk: 'Afhandlingsprojekt der undersøger inputmetoder til billede-til-billede-redigering i offentligt redesign.' })}</div>
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
            <div className="project-authors">{t({ en: 'Authors: Cody Jackson, Farika M.M. Farook, and Ma Shalah', dk: 'Forfattere: Cody Jackson, Farika M.M. Farook og Ma Shalah' })}</div>
          </div>
          <div className="project-footer">
            <p>
              {t({
                en: 'Over a period of 1 year, our 3 person team researched existing methods of interacting with AI models, identified a specific site to test a future prototype, surveyed users in the area for how they would interact with a redesign AI, then designed, implemented, and tested a multi-modal (Text, Voice, Inpainting, Drag & Drop) prototype allowing users to take a photo of the space and redesign it in real time utilizing the FLUX family of AI models.',
                dk: 'Over en periode på 1 år undersøgte vores 3-personers team eksisterende metoder til interaktion med AI-modeller, identificerede et sted til at teste en fremtidig prototype, undersøgte brugere om, hvordan de ville interagere med en redesign-AI, og designede, implementerede og testede en multimodal (Tekst, Tale, Inpainting, Drag & Drop) prototype, der gjorde det muligt for brugere at tage et foto af rummet og redesigne det i realtid ved hjælp af FLUX-familien af AI-modeller.'
              })}
            </p>
            <div className="project-tags">
              <span className="project-tag" style={{ "--tag-color": "#eecd14" } as CSSProperties}>Thesis Project</span>
              <span className="project-tag" style={{ "--tag-color": "#16f962" } as CSSProperties}>Team</span>
              <span className="project-tag" style={{ "--tag-color": "#ec45d0" } as CSSProperties}>Leadership</span>
              <span className="project-tag" style={{ "--tag-color": "#7c3aed" } as CSSProperties}>Generative AI</span>
              <span className="project-tag" style={{ "--tag-color": "#14b8a6" } as CSSProperties}>UX Research</span>
              <span className="project-tag" style={{ "--tag-color": "#f97316" } as CSSProperties}>System Design</span>
              <span className="project-tag" style={{ "--tag-color": "#38bdf8" } as CSSProperties}>React</span>
            </div>
          </div>
        </div>

        <div className="project-card project-large">
          <div className="project-header-group">
            <div className="project-header">{t({ en: 'BadgerInfo++: A Layered-Explanation Extension for Web-Tracking Transparency', dk: 'BadgerInfo++: En lagdelt forklaringsudvidelse til web-tracking gennemsigtighed' })}</div>
            <div className="project-subheader">{t({ en: 'Semester project investigating how different levels of information display influence user experiences with online privacy via an expanded browser extension.', dk: 'Semestreprojekt der undersøger, hvordan forskellige niveauer af informationsvisning påvirker brugeroplevelser med online privatliv via en udvidet browserudvidelse.' })}</div>
          </div>
          <div className="project-content">
            <ImageCarousel images={badgerInfoImages} />
            <div className="project-links">
              <ProjectLink
                icon={<img src={pdfIcon} alt="PDF icon" />}
                href={badgerInfoPdf}
                ariaLabel="Download thesis PDF"
                color="#ec4899"
                download
              />
              <ProjectLink
                icon={<img src={githubIcon} alt="Github icon" />}
                href="https://github.com/Jumps0/CSIT8-DWTA"
                ariaLabel="View on GitHub"
                color="#38bdf8"
              />
            </div>
            <div className="project-authors">
              {t({ en: 'Authors: Cody Jackson, Jocelyne Chakupewa Mululu, Anastasios “Tasos” Benos, Farika Magjabeen Mohamed Farook, Yusrat Adebisi Jimoh, Md Symun Noor', dk: 'Forfattere: Cody Jackson, Jocelyne Chakupewa Mululu, Anastasios “Tasos” Benos, Farika Magjabeen Mohamed Farook, Yusrat Adebisi Jimoh, Md Symun Noor' })}
            </div>
          </div>
          <div className="project-footer">
            <p>
              {t({ 
                en: 'During spring 2026 our 6 person team researched existing privacy-centric browser extensions, picking Privacy Badger as our focus, and then expanded the extension to display varying amounts of information, examining how the level and amount of information displayed influences perceived transparency, user engagement, and confidence in managing personal data.', 
                dk: 'I foråret 2026 undersøgte vores team på 6 personer eksisterende privatlivscentrerede browserudvidelser, valgte Privacy Badger som vores fokus, og udvidede derefter udvidelsen til at vise varierende mængder information. Vi undersøgte, hvordan niveauet og mængden af ​​viste information påvirker opfattet gennemsigtighed, brugerengagement og tillid til håndtering af personoplysninger.' 
              })}
            </p>
            <div className="project-tags">
              <span className="project-tag" style={{ "--tag-color": "#eecd14" } as CSSProperties}>Thesis Project</span>
              <span className="project-tag" style={{ "--tag-color": "#16f962" } as CSSProperties}>Team</span>
              <span className="project-tag" style={{ "--tag-color": "#ec45d0" } as CSSProperties}>Leadership</span>
              <span className="project-tag" style={{ "--tag-color": "#686272" } as CSSProperties}>Informative</span>
              <span className="project-tag" style={{ "--tag-color": "#14b8a6" } as CSSProperties}>UX Research</span>
              <span className="project-tag" style={{ "--tag-color": "#16f99a" } as CSSProperties}>Browser Extension</span>
              <span className="project-tag" style={{ "--tag-color": "#f8eb38" } as CSSProperties}>Javascript</span>
            </div>
          </div>
        </div>

        <div className="project-card project-large">
          <div className="project-header-group">
            <div className="project-header">{t({ en: 'Project Escher', dk: 'Project Escher' })}</div>
            <div className="project-subheader">{t({ en: 'Capstone project which created a VR puzzle game in the Unity Engine.', dk: 'Capstone-projekt, der skabte et VR-puslespil i Unity Engine.' })}</div>
          </div>
          <div className="project-content">
            <YouTubeVideo videoUrl="https://www.youtube.com/watch?v=DQ_lG05XAFs" />
            <div className="project-authors">{t({ en: 'Authors: Cody Jackson, Sebastien Yokoyama, and Zachary Kruljac', dk: 'Forfattere: Cody Jackson, Sebastien Yokoyama og Zachary Kruljac' })}</div>
          </div>
          <div className="project-footer">
            <p>
              {t({ 
                en: 'Over a period of 1 year, our 3 person team meticulously planned, designed, and implemented a VR puzzle game in the Unity Game engine for our Capstone project. I acted as the leader of this project, while also handling technical design and implementation.', 
                dk: 'Over en periode på 1 år planlagde, designede og implementerede vores 3-personers team omhyggeligt et VR-puslespil i Unity-spilmotoren til vores Capstone-projekt. Jeg fungerede som projektleder, samtidig med at jeg håndterede teknisk design og implementering.' 
              })}
            </p>
            <div className="project-tags">
              <span className="project-tag" style={{ "--tag-color": "#eecd14" } as CSSProperties}>Capstone Project</span>
              <span className="project-tag" style={{ "--tag-color": "#16f962" } as CSSProperties}>Team</span>
              <span className="project-tag" style={{ "--tag-color": "#ec45d0" } as CSSProperties}>Leadership</span>
              <span className="project-tag" style={{ "--tag-color": "#1678f9" } as CSSProperties}>Unity Game Engine</span>
              <span className="project-tag" style={{ "--tag-color": "#7369ce" } as CSSProperties}>C#</span>
            </div>
          </div>
        </div>

        <div className="project-pair">
          <div className="project-card project-small">
            <div className="project-header-group">
              <div className="project-header">Cogworld</div>
              <div className="project-subheader">{t({ en: 'A Unity remake of the hit indie roguelike Cogmind.', dk: 'En Unity-genindspilning af det populære indie-roguelike-spil Cogmind.' })}</div>
            </div>
          <div className="project-content">
            <div className="project-media-frame">
                <img className="project-media-image" src={cogworldImage} alt="Cogworld gameplay image" />
              </div>
            <div className="project-links">
              <ProjectLink
                icon={<img src={githubIcon} alt="Github icon" />}
                href="https://github.com/Jumps0/Cogworld"
                ariaLabel="View on GitHub"
                color="#38bdf8"
              />
            </div>
          </div>
            <div className="project-footer">
            <p>
              {t({ 
                en: 'I worked on this project on-and-off before I started my masters. I really enjoyed the gameplay of the original and wanted to expand it in my own way, starting from scratch in Unity. Utilizing the original sprites and audio I got pretty far into a believable replica, and had a great time developing it too whenever I had the occasional a burst of motivation.', 
                dk: 'Jeg arbejdede på dette projekt fra tid til anden, før jeg startede på min kandidatuddannelse. Jeg nød virkelig gameplayet i originalen og ville gerne udvide det på min egen måde, starte helt fra bunden i Unity. Ved at bruge de originale sprites og lyd kom jeg ret langt i en troværdig kopi, og jeg havde det også sjovt med at udvikle det, når jeg lejlighedsvis fik et udbrud af motivation.' 
              })}
            </p>
            <div className="project-tags">
              <span className="project-tag" style={{ "--tag-color": "#1678f9" } as CSSProperties}>Unity Game Engine</span>
              <span className="project-tag" style={{ "--tag-color": "#7369ce" } as CSSProperties}>C#</span>
            </div>
          </div>
          </div>

          <div className="project-card project-small">
            <div className="project-header-group">
              <div className="project-header">D&D Command</div>
              <div className="project-subheader">{t({ en: 'A "CS381 Game Engines" class project mixing the gameplay of XCOM and Dungeons & Dragons.', dk: 'Et "CS381 Game Engines"-klasseprojekt, der blander gameplayet fra XCOM og Dungeons & Dragons.' })}</div>
            </div>
            <div className="project-content">
              <div className="project-media-frame">
                <img className="project-media-image" src={dndCommandImage} alt="D&D Command gameplay image" />
              </div>
            <div className="project-links">
              <ProjectLink
                icon={<img src={unityIcon} alt="Unity Play icon" />}
                href="https://play.unity.com/en/games/4e158bbc-758d-467d-bf95-2c883ca4781f/381-dd-command-hotfix"
                ariaLabel="Play now"
                color="#38f848"
              />
              <ProjectLink
                icon={<img src={githubIcon} alt="Github icon" />}
                href="https://github.com/Jumps0/CodyJackson010-381-Final-Project"
                ariaLabel="View on GitHub"
                color="#38bdf8"
              />
            </div>
            <div className="project-authors">
              {t({ en: 'Authors: Cody Jackson, and Zachary Kruljac', dk: 'Forfattere: Cody Jackson og Zachary Kruljac' })}
            </div>
          </div>
            <div className="project-footer">
            <p>
              {t({ 
                en: 'A grid based & turn based game that simulates the combat of Dungeons and Dragons (DnD) in a style similar to XCOM 2. A few (2-3) “scenarios” will be given starring different characters facing different enemies in different environments. Each player character can have a different class and abilities along with differing stats that determine the actions they can take during their turn of combat. Dice rolling will decide the outcome of most actions. Most, if not all of this project was coded by me.', 
                dk: 'Et gitterbaseret og turbaseret spil, der simulerer kampene i Dungeons and Dragons (DnD) i en stil, der minder om XCOM 2. Der vil blive givet et par (2-3) "scenarier", hvor forskellige karakterer står over for forskellige fjender i forskellige miljøer. Hver spillerkarakter kan have en forskellig klasse og evner sammen med forskellige statistikker, der bestemmer de handlinger, de kan foretage sig i løbet af deres kamptur. Terningkast vil afgøre resultatet af de fleste handlinger. Det meste, hvis ikke hele, af dette projekt er kodet af mig.' 
              })}
            </p>
            <div className="project-tags">
              <span className="project-tag" style={{ "--tag-color": "#16f962" } as CSSProperties}>Team</span>
              <span className="project-tag" style={{ "--tag-color": "#ec45d0" } as CSSProperties}>Leadership</span>
              <span className="project-tag" style={{ "--tag-color": "#1678f9" } as CSSProperties}>Unity Game Engine</span>
              <span className="project-tag" style={{ "--tag-color": "#7369ce" } as CSSProperties}>C#</span>
            </div>
          </div>
          </div>
        </div>

        <div className="project-pair">
          <div className="project-card project-small">
            <div className="project-header-group">
              <div className="project-header">Twitch Chat Big Data Analysis</div>
              <div className="project-subheader">{t({ en: 'Analysis of \'emote\' usage in difference Twitch chat livestreams.', dk: 'Analyse af brugen af \'emote\' i forskellige Twitch-chat-livestreams.' })}</div>
            </div>
          <div className="project-content">
            <div className="project-media-frame">
                <img className="project-media-image" src={bigdataImage} alt="Section of recorded twitch chat data on the channel 'Lirik'" />
              </div>
            <div className="project-links">
              <ProjectLink
                icon={<img src={githubIcon} alt="Github icon" />}
                href="https://github.com/Jumps0/CS431-BigData-Project"
                ariaLabel="View on GitHub"
                color="#38bdf8"
              />
            </div>
            <div className="project-authors">
              {t({ en: 'Authors: Cody Jackson, and Zachary Kruljac', dk: 'Forfattere: Cody Jackson og Zachary Kruljac' })}
            </div>
          </div>
            <div className="project-footer">
            <p>
              {t({ 
                en: 'A team project for the CS431 Big Data class where I analyzed the \'emote\' usage across various types of livestreamers on the Twitch platform. Data was collected from live chat, recorded, and analyzed using a python script. I handled the project design, coding, and data collection for this project.', 
                dk: 'Et teamprojekt for CS431 Big Data-klassen, hvor jeg analyserede brugen af \'emote\' på tværs af forskellige typer livestreamere på Twitch-platformen. Data blev indsamlet fra livechat, optaget og analyseret ved hjælp af et Python-script. Jeg håndterede projektdesign, kodning og dataindsamling til dette projekt.' 
              })}
            </p>
            <div className="project-tags">
              <span className="project-tag" style={{ "--tag-color": "#16f962" } as CSSProperties}>Team</span>
              <span className="project-tag" style={{ "--tag-color": "#ec45d0" } as CSSProperties}>Leadership</span>
              <span className="project-tag" style={{ "--tag-color": "#f92516" } as CSSProperties}>Python</span>
              <span className="project-tag" style={{ "--tag-color": "#5cd6f5" } as CSSProperties}>Big Data</span>
              <span className="project-tag" style={{ "--tag-color": "#64a08c" } as CSSProperties}>Data Analysis</span>
            </div>
          </div>
          </div>

          <div className="project-card project-small">
            <div className="project-header-group">
              <div className="project-header">Foxhole Machine Learning / Vision</div></div>
              <div className="project-subheader">{t({ en: 'Hand labeled / trained player recognition system for the game Foxhole.', dk: 'Håndmærket/trænet spillergenkendelsessystem til spillet Foxhole.' })}</div>
          <div className="project-content">
              <div className="project-media-frame">
                <VideoPlayer src={showcaseVideo} ariaLabel="Showcase video" />
              </div>
          </div>
            <div className="project-footer">
            <p>
              {t({ 
                en: 'In python I created a computer vision script which analyzed frames from the MMO \'Foxhole\' then identified and drew boxes around players. I did this by hand labeling screenshots and feeding them into a YoloV8 vision model which I trained on my own hardware. I was pleased by the results and only stopped due to the exponential training time.', 
                dk: 'I Python lavede jeg et computer vision-script, der analyserede billeder fra MMO\'en \'Foxhole\' og derefter identificerede og tegnede bokse omkring spillerne. Jeg gjorde dette ved at mærke screenshots manuelt og indsætte dem i en YoloV8 vision-model, som jeg trænede på min egen hardware. Jeg var tilfreds med resultaterne og stoppede kun på grund af den eksponentielle træningstid.' 
              })}
            </p>
            <div className="project-tags">
              <span className="project-tag" style={{ "--tag-color": "#ac9aca" } as CSSProperties}>Machine Learning</span>
              <span className="project-tag" style={{ "--tag-color": "#b9bb32" } as CSSProperties}>Computer Vision</span>
              <span className="project-tag" style={{ "--tag-color": "#f92516" } as CSSProperties}>Python</span>
              <span className="project-tag" style={{ "--tag-color": "#f55c9c" } as CSSProperties}>Data Labeling</span>
              <span className="project-tag" style={{ "--tag-color": "#e256d6" } as CSSProperties}>YoloV8</span>
            </div>
          </div>
          </div>
          </div>
        {/*
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
        */}

        {/*
        <div className="project-card project-large">
          <div className="project-header">Big Project Title</div>
          <div className="project-content">
            <div className="placeholder">Content or image</div>
          </div>
          <div className="project-footer">A short descriptive paragraph about the big project. Explain technologies used, role, and outcome.</div>
        </div>
      */}
      </div>

    </section>
  );
}

export default ProjectsPage;
