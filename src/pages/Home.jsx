import "./Home.css";

export default function Home() {
  return (
    <div className="container">
      <nav>
        <li>Gallery</li>
        <li>FAQ</li>
        <li>Help</li>
      </nav>
      <img src="/images/doodlemaps.png" alt="Doodle Maps logo" />
      <button>Play</button>
    </div>
  );
}
