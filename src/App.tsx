import './App.css'

function App() {
  return (
    <main className="app-shell">
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
              <dd>+45 25 12 29 23</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>cody@krselectric.com</dd>
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
    </main>
  )
}

export default App
