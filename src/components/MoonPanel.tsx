import "../styles/moon-panel.css";

export default function MoonPanel() {
  return (
    <aside className="moon-panel">
      <div className="moon-panel__sky">
        <div className="moon-panel__stars" />
        <div className="moon-panel__mountain moon-panel__mountain--back" />
        <div className="moon-panel__mountain moon-panel__mountain--front" />
        <div className="moon-panel__mist" />
        <div className="moon-panel__lake">
          <div className="moon-panel__reflection" />

          <div className="moon-panel__ripples">
            <span />
            <span />
            <span />
          </div>
        </div>
        <p className="moon-panel__quote">
          Um passo de cada vez
          <br />
          também ilumina o caminho.
        </p>

        <div className="moon-panel__moon" />
      </div>
    </aside>
  );
}
