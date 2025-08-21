import "./Home.css";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const goToGallery = () => {
    navigate("/gallery");
  };
  const goToMap = () => {
    navigate("/map");
  };

  return (
    <div className="container">
      <img src="/images/doodlemaps.png" alt="Doodle Maps logo" />
      <div className="how-to">
        <h2 className="how-to-heading">How to play:</h2>
        <p className="how-to-text">
          1: Pick a Spot! The Map shows several Doodle Spots that refresh every
          4 hours.
        </p>
        <p className="how-to-text">
          2: Time to Doodle! Upon arrival, check out your surroundings and draw
          what inspires you!
        </p>
        <p className="how-to-text">
          3: Save it! Done with your masterpiece? You are ink-credible! Tap Save
          to share your artwork to the gallery.
        </p>
      </div>
      <div className="home-buttons">
        <button onClick={goToGallery} className="button">
          Gallery
        </button>
        <button onClick={goToMap} className="button">
          Play
        </button>
      </div>
    </div>
  );
}
