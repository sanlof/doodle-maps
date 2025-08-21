import "./Success.css";
import { useNavigate } from "react-router";

export default function Success() {
  const navigate = useNavigate();
  const goToMap = () => {
    navigate("/map");
  };
  const goToGallery = () => {
    navigate("/gallery");
  };

  return (
    <section className="success">
      <img src="/images/welldone.png" alt="Well done" />
      <h1>Well done!</h1>
      <p>Your artwork has been saved in the gallery</p>
      <section className="buttons">
        <button onClick={goToGallery}>Gallery</button>
        <button onClick={goToMap}>Map</button>
      </section>
    </section>
  );
}
