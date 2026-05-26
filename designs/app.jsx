// ============================================================
// kpsolutions.io — Homepage · app shell
// ============================================================

function App() {
  React.useEffect(() => {
    document.documentElement.classList.add('js-reveal');
  }, []);

  return (
    <>
      <Header />
      <main>
        <Hero />
        <DirectAnswer />
        <WhoeverYouAre />
        <AtmosphericInterludeStudio />
        <CapabilityTiles />
        <SelectedWork />
        <PinnedBuildMoment />
        <ProcessCallout />
        <ClosingCTA />
      </main>
      <Footer />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
