import { useLanguage } from './LanguageProvider';

function OtherPage() {
  const { t } = useLanguage();

  return (
    <section className="blank-page">
      <div className="section-card">
        <h3>{t({ en: 'OTHER', dk: 'ANDRE' })}</h3>
        <p>{t({ en: 'To be expanded...', dk: 'Skal udvides...' })}</p>
      </div>
    </section>
  )
}

export default OtherPage
