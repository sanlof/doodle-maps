// Toolbar.jsx
import React from "react";

export default function Toolbar({
  lineWidthRef,
  ctxRef,
  canvasRef,
  lineColorRef,
}) {
  const onToolbarChange = (e) => {
    if (!e.target) return;

    if (e.target.id === "lineColor") {
      lineColorRef.current = e.target.value; // <-- uppdatera ref
    }

    if (e.target.name === "lineWidth") {
      lineWidthRef.current = Number(e.target.value);
    }
  };

  const onToolbarClick = (e) => {
    if (e.target.id === "clear") {
      const ctx = ctxRef.current;
      const canvas = canvasRef.current;
      if (ctx && canvas) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  return (
    <div onClick={onToolbarClick} onChange={onToolbarChange}>
      <label htmlFor="lineColor">Color</label>
      <input
        id="lineColor"
        name="lineColor"
        type="color"
        defaultValue={lineColorRef.current}
      />

      <fieldset>
        <legend>Line Width</legend>
        <label htmlFor="lineWidthThin">Thin</label>
        <input id="lineWidthThin" name="lineWidth" type="radio" value="2" />
        <label htmlFor="lineWidthMedium">Medium</label>
        <input id="lineWidthMedium" name="lineWidth" type="radio" value="5" />
        <label htmlFor="lineWidthFat">Fat</label>
        <input id="lineWidthFat" name="lineWidth" type="radio" value="8" />
      </fieldset>

      <button id="clear" type="button">
        Clear
      </button>
    </div>
  );
}
