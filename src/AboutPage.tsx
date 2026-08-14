import { useLanguage } from './LanguageProvider';
function AboutPage() {
  const { t } = useLanguage();
  return (
    <>
      <section className="title-section">
        <aside className="contact-card">
          <h3>{t({ en: 'Contact', dk: 'Kontakte' })}</h3>
          <dl>
            <div>
              <dt>{t({ en: 'Address', dk: 'Adresse' })}</dt>
              <dd>
                Tankedraget 3, 2. 1 <br /> 9000 Aalborg, Denmark
              </dd>
            </div>
            <div>
              <dt>{t({ en: 'Phone', dk: 'Telefon' })}</dt>
              <dd>
                <a href="tel:+45251229">+45 25 12 29 23</a>
              </dd>
            </div>
            <div>
              <dt>Email</dt>
              <a href="mailto:cody@krselectric.com">cody@krselectric.com</a>
            </div>
            <div>
              <dt>LinkedIn</dt>
              <dd>
                <a
                  href="https://www.linkedin.com/in/cody-jackson-662874191/"
                  target="_blank"
                  rel="noreferrer"
                >
                  linkedin.com/in/cody-jackson-662874191/
                </a>
              </dd>
            </div>
          </dl>
        </aside>

        <div className="titles">
          <h1>Cody Jackson</h1>
          <h2>{t({ en: 'Software Developer', dk: 'Softwareudvikler' })}</h2>
        </div>
      </section>

      <section className="profile">
        <div className="section-card">
          <h3>{t({ en: 'PROFILE', dk: 'PROFIL' })}</h3>
          <p>
            {t({
              en: 
                'I am a college educated programming enthusiast with a Masters of Science in Computer Science & Engineering who is proficient in multiple programming languages. I have also achieved the rank of Eagle in the Boy Scouts of America. I thoroughly enjoy programming and software development. I have worked solo and on group projects, having provided my leadership skills when necessary. I am currently seeking a position in my field that will allow me to display my skills and work on projects that matter, valuing the opportunity to work on meaningful projects rather than a high salary. I am actively learning the Danish language, have Danish relatives in every kommune along with Danish grandparents, and hope to eventually become a Danish citizen.', 
              dk:
                'Jeg er en universitetsuddannet programmeringsentusiast med en kandidatgrad i datalogi og ingeniørvidenskab, der er dygtig til flere programmeringssprog. Jeg har også opnået rang af Eagle i Boy Scouts of America. Jeg nyder programmering og softwareudvikling i høj grad. Jeg har arbejdet solo og på gruppeprojekter og har bidraget med mine lederevner, når det har været nødvendigt. Jeg søger i øjeblikket en stilling inden for mit felt, der giver mig mulighed for at vise mine færdigheder og arbejde på projekter, der betyder noget, og værdsætter muligheden for at arbejde på meningsfulde projekter snarere end en høj løn. Jeg lærer aktivt dansk, har danske slægtninge i hver kommune sammen med danske bedsteforældre og håber på engang at blive dansk statsborger.'
            })}
            
          </p>
        </div>
      </section>

      <section className="education">
        <div className="section-card">
          <h3>{t({ en: 'EDUCATION', dk: 'UNDERVISNING' })}</h3>
          <div className="education-grid">
            <article className="nested-card">
              <h4>{t({ en: 'MSc in Computer Science (IT), Aalborg University, Denmark', dk: 'Kandidatuddannelser i Datalogi (IT), Aalborg Universitet, Danmark' })}</h4>
              <span className="small-year">2024 - 2026</span>
              <p>
                {t({
                  en: 'Studied Computer Science with a focus on Machine Learning, Application Design, and AI, including hands-on experience with technologies such as React, Typescript, and Python.',
                  dk: 'Studerede datalogi med fokus på maskinlæring, applikationsdesign og AI, herunder praktisk erfaring med teknologier som React, Typescript og Python.'
                })}
              </p>
              <p>•	{t({ en: 'Past projects', dk: 'Tidligere projekter' })}: ML Plant Predictor, BadgerInfo++ Addon</p>
              <p>•	{t({ en: 'Thesis project', dk: 'Afhandlingsprojekt' })}: Optimizing Input in AI Powered Public Redesign</p>
            </article>
            <article className="nested-card">
              <h4>{t({ en: 'BSc in Computer Science & Engineering, University of Nevada Reno, USA', dk: 'Bachelorgrad i Datalogi & Ingeniørarbejde, University of Nevada Reno, USA' })}</h4>
              <span className="small-year">2019 - 2023</span>
              <p>
                {t({
                  en: 'Studied Computer Science and Computer Engineering, with a focus on Computer Science (Programming).',
                  dk: 'Studerede datalogi og datateknik med fokus på datalogi (programmering).'
                })}
              </p>
              <p>•	{t({ en: 'Other courses include', dk: 'Andre kurser omfatter' })}; Game Engine Development, AI in Games, Virtual Reality, Machine Learning</p>
              <p>•	{t({ en: 'Capstone project', dk: 'Capstone projekt' })} “Project Escher”, A Virtual-Reality Puzzle game (Team of 3)</p>
              <p>•	{t({ en: 'Past projects', dk: 'Tidligere projekter' })}: “Cogworld”, “D&D Command”, “15 Puzzle /w Assistant</p>
              <p>•	GPA: 3.3</p>
            </article>
          </div>
        </div>
      </section>

      <section className="professional-experience">
        <div className="section-card">
          <h3>{t({ en: 'PROFESSIONAL EXPERIENCE', dk: 'PROFESSIONAL ERFARING' })}</h3>
          <article className="nested-card">
            <h4>In-Store Representative, Neptune Retail Solutions, USA</h4>
            <span className="small-year">2021 - 2023</span>
            <p>
              {t({ en: 'Developed and implemented point of sale media strategies in various retail environments, enhancing customer engagement and sales performance;', dk: 'Udviklede og implementerede salgsstrategier for point of sale i forskellige detailmiljøer, hvilket forbedrede kundeengagement og salgspræstation;' })}
            </p>
            <p>•	{t({ en: 'Work independently and unsupervised in front/back of retail stores,', dk: 'Arbejde selvstændigt og uden opsyn foran/bagved detailbutikker,' })}</p>
            <p>•	{t({ en: 'Precisely display staging with attention to detail,', dk: 'Præcis iscenesættelse med sans for detaljer,' })}</p>
            <p>•	{t({ en: 'Utilize strong organizational skills to check and reset advertising materials to current campaign.', dk: 'Brug stærke organisatoriske færdigheder til at kontrollere og tilpasse reklamemateriale til den aktuelle kampagne.' })}</p>
          </article>
        </div>
      </section>

      <section className="other-experience">
        <div className="section-card">
          <h3>{t({ en: 'OTHER EXPERIENCE', dk: 'ANDRE ERFARING' })}</h3>
          <article className="nested-card">
            <h4>Boy Scout/Eagle Scout, Boy Scouts of America, USA</h4>
            <span className="small-year">2011 - 2018</span>
            <p>
              {t({
                en: 'Achieved the rank of Eagle Scout by leading community projects, effectively communicating with diverse groups to solicit donations and supports. During my Eagle Scout Project, I lead a team of younger scouts to assemble “Starter Kits” for Dog & Cat fosters, donating them to a local Sacramento animal shelter.',
                dk: 'Opnåede rang som Eagle Scout ved at lede lokalsamfundsprojekter og effektivt kommunikere med forskellige grupper for at indsamle donationer og støtte. Under mit Eagle Scout-projekt ledte jeg et team af yngre spejdere for at sammensætte "startsæt" til hunde- og katteplejefamilier og donere dem til et lokalt dyreinternat i Sacramento.'
              })}
            </p>
          </article>
        </div>
      </section>

      <section className="certifications">
        <div className="section-card">
          <h3>{t({ en: 'CERTIFICATIONS', dk: 'CERTIFICERINGER' })}</h3>
          <div className="certification-list">
            <div>
              <a className="section-link" href="https://d.docs.live.net/ff769c34c1c26bb6/Desktop/Job/Certifications/Agile/UC-9f7c2033-7fc1-47e2-bd8a-cf1ea5a070fa.pdf" target="_blank" rel="noreferrer">
                •	Agile Certification, AgileKB, USA
              </a>
            </div>
            <div>
              <a className="section-link" href="https://d.docs.live.net/ff769c34c1c26bb6/Desktop/Job/Certifications/PLC/UC-1a5489e1-c70a-4248-a439-f067b0e7d771.pdf" target="_blank" rel="noreferrer">
                •	PLC Hardware/Software Certification, United Engineering, USA
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="languages">
        <div className="section-card">
          <h3>{t({ en: 'LANGUAGES', dk: 'SPROG' })}</h3>
          <a>•	{t({ en: 'English: Native', dk: 'Engelsk: Modersmål' })}</a>
          <br />
          <a>•	{t({ en: 'Danish: Actively Learning (DU3 - MODUL 3)', dk: 'Dansk: Aktiv danskundervisning (DU3 - MODUL 3)' })}</a>
          <br />
          <a>•	{t({ en: 'Mandarin Chinese: Basic (High School)', dk: 'Mandarin kinesisk: Grundlæggende (Gymnasium)' })}</a>
        </div>
      </section>

      <section className="professional-skills">
        <div className="section-card">
          <h3>{t({ en: 'PROFESSIONAL SKILLS', dk: 'PROFESSIONAL FÆRDIGHEDER' })}</h3>
          <div className="skills-grid">
            <div className="skill-item"><strong>AI / ML / Coding Agents</strong></div>
            <div className="skill-item"><strong>C/C++</strong></div>
            <div className="skill-item"><strong>C#</strong></div>
            <div className="skill-item"><strong>.NET</strong></div>
            <div className="skill-item"><strong>Python</strong></div>
            <div className="skill-item"><strong>SQL</strong></div>
            <div className="skill-item"><strong>Git</strong></div>
            <div className="skill-item"><strong>PLC/Ladder Logic</strong></div>
            <div className="skill-item"><strong>React</strong></div>
            <div className="skill-item"><strong>Typescript</strong></div>
            <div className="skill-item"><strong>Unity Game Engine</strong></div>
          </div>
        </div>
      </section>

      <section className="profile">
        <div className="section-card">
          <h3>{t({ en: 'INTERESTS', dk: 'INTERESSER' })}</h3>
          <p>
            {t({ 
              en: 'I deeply enjoy programming, and regularly start new projects when I come up with a unique idea or something that I think would be fun to work on. I try to challenge myself by learning new programming languages and what they can be best used for. I occasionally make games in the Unity Game engine and prefer the flexibility of the C# language (also Python). I enjoy meeting with friends, and occasionally playing Dungeons & Dragons with my former University colleagues. I am also interested in PLC Ladder logic design/programming.', 
              dk: 'Jeg nyder programmering meget og starter regelmæssigt nye projekter, når jeg får en unik idé eller noget, som jeg synes ville være sjovt at arbejde på. Jeg prøver at udfordre mig selv ved at lære nye programmeringssprog og hvad de bedst kan bruges til. Jeg laver af og til spil i Unity-spilmotoren og foretrækker fleksibiliteten i C#-sproget (også Python). Jeg nyder at mødes med venner og af og til spille Dungeons & Dragons med mine tidligere universitetskolleger. Jeg er også interesseret i PLC Ladder-logikdesign/programmering.' 
            })}
          </p>
        </div>
      </section>

      <section className="references">
        <div className="section-card">
          <h3>{t({ en: 'REFERENCES', dk: 'REFERENCER' })}</h3>
          <p>{t({ en: 'Available on request.', dk: 'Tilgængelig på forespørgsel.' })}</p>
        </div>
      </section>
    </>
  )
}

export default AboutPage
