// ============================================================
// kpsolutions.io — /about · app shell
// ============================================================

function AboutApp() {
  React.useEffect(() => {
    document.documentElement.classList.add('js-reveal');
  }, []);

  return (
    <>
      <Header heroMode="light" />
      <main>
        <AboutHero />
        <AboutFounder />
        <AboutWhy />
        <AboutBreak />
        <AboutPrinciples />
        <AboutNotDo />
        <AboutClosing />
      </main>
      <Footer />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<AboutApp />);
