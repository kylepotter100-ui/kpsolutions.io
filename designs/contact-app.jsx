// ============================================================
// kpsolutions.io — /contact · app shell
// ============================================================

function ContactApp() {
  React.useEffect(() => {
    document.documentElement.classList.add('js-reveal');
  }, []);

  return (
    <>
      <Header heroMode="light" />
      <main>
        <ContactHero />
        <ContactMain />
        <ContactBreak />
        <ContactNext />
        <ContactNote />
      </main>
      <Footer />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<ContactApp />);
