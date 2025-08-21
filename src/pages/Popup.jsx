import "./Popup.css";

export default function Popup({ title, onStart }) {
  return (
    <div className="popup-content">
      <h2>You have reached a Doodle Spot!</h2>
      <p>
        Look around you for inspiration and share your artwork with the rest of
        Lindholmen!
      </p>
      <button onClick={onStart}>Start drawing</button>
      <img src="images/dog.png"></img>
    </div>
  );
}
