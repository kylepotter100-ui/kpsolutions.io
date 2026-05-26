// ============================================================
// kpsolutions.io — /work/potter-sanctuary · app shell
// ============================================================

function PotterSanctuaryApp() {
  React.useEffect(() => {
    document.documentElement.classList.add('js-reveal');
  }, []);

  return (
    <>
      <Header heroMode="dark" />
      <main>
        <CaseHero />
        <CaseMeta />
        <CaseChallenge />
        <CaseApproach />
        <CaseGallery />
        <CaseBreak />
        <CaseOutcome />
        <CaseStack />
        <CaseClosing />
      </main>
      <Footer />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<PotterSanctuaryApp />);
