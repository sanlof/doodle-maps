import "./Home.css";

export default function Home() {
  return (
    <div className="container">
      <nav>
        <li>Gallery</li>
        <li>FAQ</li>
        <li>Help</li>
      </nav>
      <img src="src/public/images/doodlemaps.png" alt="" />
      <button>Play</button>
    </div>
  );
}
