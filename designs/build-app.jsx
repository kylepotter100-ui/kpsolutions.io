// ============================================================
// kpsolutions.io — /build · app shell
// ============================================================

function BuildApp() {
  React.useEffect(() => {
    document.documentElement.classList.add('js-reveal');
  }, []);

  return (
    <>
      <Header heroMode="light" />
      <main>
        <BuildHero />
        <CustomPlatforms />
        <InternalTools />
        <AIVisible />
        <AtmosphericBreak />
        <Integrations />
        <LegacyReplacement />
        <BuildClosing />
      </main>
      <Footer />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<BuildApp />);
