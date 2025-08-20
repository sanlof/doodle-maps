import "./Home.css";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const goToMap = () => {
    navigate("/map");
  };

  return (
    <div className="container">
      <nav>
        <li>Gallery</li>
        <li>FAQ</li>
        <li>Help</li>
      </nav>
      <img src="/images/doodlemaps.png" alt="Doodle Maps logo" />
      <button onClick={goToMap}>Play</button>
    </div>
  );
}
