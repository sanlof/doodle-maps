import "./Success.css";
import { useNavigate } from "react-router";

export default function Success() {
  const navigate = useNavigate();
  const goToMap = () => {
    navigate("/map");
  };
  const goToGallery = () => {
    navigate("/gallery", { state: { from: "success" } });
  };

  return (
    <section className="success">
      <img src="/images/welldone.png" alt="Well done" />
      <h1>Well done!</h1>
      <p>Your artwork has been saved in the gallery</p>
      <section className="buttons">
        <button className="button" onClick={goToGallery}>
          Gallery
        </button>
        <button className="button" onClick={goToMap}>
          Map
        </button>
      </section>
    </section>
  );
}
