import LeadForm from '../../components/LeadForm';
import styles    from './LandingPage.module.css';

export default function LandingPage() {
  return (
    <div className={styles.page}>
      {/* ── Navbar ─────────────────────────────────────── */}
      <header className={styles.nav}>
        <div className="container">
          <span className={styles.logo}>
            <span className={styles.logoDot} />
            LeadCapture
          </span>
        </div>
      </header>

      <main>
        {/* ── Hero ───────────────────────────────────────── */}
        <section className={styles.hero}>
          <div className={`container ${styles.heroInner}`}>
            <div className={styles.heroText}>
              <span className={styles.badge}>🚀 Now open for new clients</span>
              <h1 className={styles.headline}>
                Let's build something
                <span className={styles.accent}> great together</span>
              </h1>
              <p className={styles.subline}>
                Tell us about your project. We'll get back to you within
                1–2 business days with a tailored proposal.
              </p>

              <ul className={styles.perks}>
                {[
                  '✦ Free initial consultation',
                  '✦ No commitment required',
                  '✦ Response within 24 hours',
                ].map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>

            {/* ── Form card ───────────────────────────────── */}
            <div className={styles.formCard}>
              <h2 className={styles.cardTitle}>Get in touch</h2>
              <p className={styles.cardSub}>Fill in the details below and we'll reach out.</p>
              <LeadForm />
            </div>
          </div>
        </section>

        {/* ── Social proof strip ─────────────────────────── */}
        <section className={styles.strip}>
          <div className="container">
            {['Trusted by 200+ founders', '4.9 ★ average rating', '98% project success rate'].map((t) => (
              <span key={t} className={styles.stripItem}>{t}</span>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
