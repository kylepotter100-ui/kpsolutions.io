// ============================================================
// kpsolutions.io — /process · app shell
// ============================================================

function ProcessApp() {
  React.useEffect(() => {
    document.documentElement.classList.add('js-reveal');
  }, []);

  return (
    <>
      <Header heroMode="light" />
      <main>
        <ProcessHero />
        <ProcessWeeks />
        <ProcessIncluded />
        <ProcessCost />
        <ProcessWhy />
        <ProcessBreak />
        <ProcessClosing />
      </main>
      <Footer />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<ProcessApp />);
