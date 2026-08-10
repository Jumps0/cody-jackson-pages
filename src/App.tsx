import './App.css'

function App() {
  return (
    <>
      <div className="app-shell">
        <section className="title-section">
          <aside className="contact-card">
            <h3>Contact</h3>
            <dl>
              <div>
                <dt>Address</dt>
                <dd>Tankedraget 3, 2. 1 <br/> 9000 Aalborg, Denmark</dd>
              </div>
              <div>
                <dt>Phone</dt>
                <dd>
                  <a href="tel:+45251229">
                    +45 25 12 29 23
                  </a>
                </dd>
              </div>
              <div>
                <dt>Email</dt>
                  <a href="mailto:cody@krselectric.com">
                    cody@krselectric.com
                  </a>
              </div>
              <div>
                <dt>LinkedIn</dt>
                <dd>
                  <a href="https://www.linkedin.com/in/cody-jackson-662874191/" target="_blank" rel="noreferrer">
                    linkedin.com/in/cody-jackson-662874191/
                  </a>
                </dd>
              </div>
            </dl>
          </aside>

          <div className="titles">
            <h1>Cody Jackson</h1>
            <h2>Software Developer</h2>
          </div>
          <div><h2></h2></div>
        </section>

        <section className="profile">
          <div className="section-card">
            <h3>PROFILE</h3>
            <p>
              I am a college educated programming enthusiast with a Masters of Science in Computer Science & Engineering who is proficient in multiple programming languages.
              I have also achieved the rank of Eagle in the Boy Scouts of America.
              I thoroughly enjoy programming and software development.
              I have worked solo and on group projects, having provided my leadership skills when necessary.
              I am currently seeking a position in my field that will allow me to display my skills and work on projects that matter, valuing the opportunity to work on meaningful projects rather than a high salary.
              I am actively learning the Danish language, have many Danish relatives across the country, and hope to eventually become a Danish citizen.
            </p>
          </div>
        </section>

        <section className="education">
          <div className="section-card">
            <h3>EDUCATION</h3>
            <div className="education-grid">
              <article className="nested-card">
                <h4>MSc in Computer Science (IT), Aalborg University, Denmark</h4>
                <span className="small-year">2024 - 2026</span>
                <p>Studied Computer Science with a focus on Machine Learning, Application Design, and AI, including hands-on experience with technologies such as React, Typescript, and Python.</p>
                <p>•	Past projects: ML Plant Predictor, BadgerInfo++ Addon</p>
                <p>•	Thesis Project: Optimizing Input in AI Powered Public Redesign</p>
              </article>
              <article className="nested-card">
                <h4>BSc in Computer Science & Engineering, University of Nevada Reno, USA</h4>
                <span className="small-year">2019 - 2023</span>
                <p>Studied Computer Science and Computer Engineering, with a focus on Computer Science (Programming).</p>
                <p>•	Other courses include; Game Engine Development, AI in Games, Virtual Reality, Machine Learning</p>
                <p>•	Capstone Project “Project Escher”, A Virtual-Reality Puzzle game (Team of 3)</p>
                <p>•	Other Projects: “Cogworld”, “D&D Command”, “15 Puzzle /w Assistant</p>
                <p>•	GPA: 3.3</p>
              </article>
            </div>
          </div>
        </section>

        <section className="professional-experience">
          <div className="section-card">
            <h3>PROFESSIONAL EXPERIENCE</h3>
            <article className="nested-card">
            <h4>In-Store Representative, Neptune Retail Solutions, USA</h4>
            <span className="small-year">2021 - 2023</span>
            <p>Developed and implemented point of sale media strategies in various retail environments, enhancing customer engagement and sales performance;</p>
            <p>•	Work independently and unsupervised in front/back of retail stores,</p>
            <p>•	Precisely display staging with attention to detail,</p>
            <p>•	Utilize strong organizational skills to check and reset advertising materials to current campaign.</p>
            </article>
          </div>
        </section>

        <section className="other-experience">
          <div className="section-card">
            <h3>OTHER EXPERIENCE</h3>
            <article className="nested-card">
            <h4>Boy Scout/Eagle Scout, Boy Scouts of America, USA</h4>
            <span className="small-year">2011 - 2018</span>
              <p>
                Achieved the rank of Eagle Scout by leading community projects, effectively communicating with diverse groups to solicit donations and supports. 
                During my Eagle Scout Project, I lead a team of younger scouts to assemble “Starter Kits” for Dog & Cat fosters, donating them to a local Sacramento animal shelter.
              </p>
            </article>
          </div>
        </section>

        <section className="certifications">
          <div className="section-card">
            <h3>CERTIFICATIONS</h3>
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
            <h3>LANGUAGES</h3>
            <a>•	English: Native</a>
            <br></br>
            <a>•	Danish: Actively Learning (DU3 - MODUL 3)</a>
            <br></br>
            <a>•	Mandarin Chinese: Basic (High School)</a>
          </div>
        </section>

        <section className="professional-skills">
          <div className="section-card">
            <h3>PROFESSIONAL SKILLS</h3>
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
            <h3>INTERESTS</h3>
            <p>
              I deeply enjoy programming, and regularly start new projects when I come up with a unique idea or something that I think would be fun to work on.
              I try to challenge myself by learning new programming languages and what they can be best used for.
              I occasionally make games in the Unity Game engine and prefer the flexibility of the C# language (also Python).
              I enjoy meeting with friends, and occasionally playing Dungeons & Dragons with my former University colleagues.
              I am also interested in PLC Ladder logic design/programming.
            </p>
          </div>
        </section>

        <section className="references">
          <div className="section-card">
            <h3>REFERENCES</h3>
            <p>
              Available on request.
            </p>
          </div>
        </section>
      </div>
    </>
  )
}

export default App
