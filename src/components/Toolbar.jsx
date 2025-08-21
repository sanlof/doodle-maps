import React, { useState } from "react";
import "./Toolbar.css";

export default function Toolbar({
  lineWidthRef,
  ctxRef,
  canvasRef,
  lineColorRef,
}) {
  const [selectedTool, setSelectedTool] = useState("brush");
  const [selectedColor, setSelectedColor] = useState(
    lineColorRef.current || "#000000"
  );

  const onToolbarChange = (e) => {
    const ctx = ctxRef.current;
    if (!ctx) return;

    if (e.target.name === "lineWidth") {
      lineWidthRef.current = Number(e.target.value);
      return;
    }

    if (e.target.name === "lineColor") {
      const color = e.target.value;
      ctx.globalCompositeOperation = "source-over";
      lineColorRef.current = color;
      setSelectedTool("brush");
      setSelectedColor(color);
      return;
    }

    if (e.target.id === "rubber") {
      ctx.globalCompositeOperation = "destination-out";
      setSelectedTool("rubber");
      return;
    }
  };

  const onToolbarClick = (e) => {
    if (e.target.id === "undo" || e.target.id === "redo") {
      window.alert("Undo/Redo functions are coming soon 🙂");
      return;
    }

    if (e.target.id === "clear") {
      if (window.confirm("Do you really want to clear the canvas?")) {
        const ctx = ctxRef.current;
        const canvas = canvasRef.current;
        if (ctx && canvas) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }
    }
  };

  return (
    <form
      onClick={onToolbarClick}
      onChange={onToolbarChange}
      className="toolbar"
    >
      <fieldset className="line-width">
        <legend>Line Width</legend>
        <input
          id="lineWidthThin"
          name="lineWidth"
          type="radio"
          value="2"
          defaultChecked
        />
        <label htmlFor="lineWidthThin">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="27"
            height="27"
            viewBox="0 0 27 27"
            fill="none"
          >
            <path
              d="M21.2097 1C21.2097 1 3.41721 4.125 1.13611 8.42188C-1.14498 12.7188 26 8.22656 26 12.9141C26 17.6016 5.6983 18.5781 3.41721 20.7266C1.13611 22.875 17.7881 26 17.7881 26"
              stroke="black"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </label>

        <input id="lineWidthMedium" name="lineWidth" type="radio" value="5" />
        <label htmlFor="lineWidthMedium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="29"
            height="29"
            viewBox="0 0 29 29"
            fill="none"
          >
            <path
              d="M22.2097 2C22.2097 2 4.41721 5.125 2.13611 9.42188C-0.144976 13.7188 27 9.22656 27 13.9141C27 18.6016 6.6983 19.5781 4.41721 21.7266C2.13611 23.875 18.7881 27 18.7881 27"
              stroke="black"
              stroke-width="3"
              stroke-linecap="round"
            />
          </svg>
        </label>

        <input id="lineWidthFat" name="lineWidth" type="radio" value="8" />
        <label htmlFor="lineWidthFat">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="29"
            height="29"
            viewBox="0 0 29 29"
            fill="none"
          >
            <path
              d="M22.2097 2C22.2097 2 4.41721 5.125 2.13611 9.42188C-0.144976 13.7188 27 9.22656 27 13.9141C27 18.6016 6.6983 19.5781 4.41721 21.7266C2.13611 23.875 18.7881 27 18.7881 27"
              stroke="black"
              stroke-width="4"
              stroke-linecap="round"
            />
          </svg>
        </label>
      </fieldset>

      <fieldset className="tools">
        <legend>Tools</legend>

        <input
          id="rubber"
          type="radio"
          checked={selectedTool === "rubber"}
          readOnly
        />
        <label
          htmlFor="rubber"
          className={selectedTool === "rubber" ? "active" : ""}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="25"
            viewBox="0 0 25 25"
            fill="none"
          >
            <path
              d="M17.922 0.781082L24.2519 7.37689C25.2494 8.43169 25.2494 10.114 24.2519 11.1688L12.5 23.4392C11.5389 24.4388 10.2376 25 8.88107 25C7.52452 25 6.22323 24.4388 5.26215 23.4392L0.748082 18.726C-0.249361 17.6712 -0.249361 15.9888 0.748082 14.934L14.3031 0.781082C15.3133 -0.260361 16.9246 -0.260361 17.922 0.781082ZM2.55115 16.83L7.07801 21.5432C8.07545 22.598 9.6867 22.598 10.6969 21.5432L15.211 16.83L8.88107 10.2208L2.55115 16.83Z"
              fill="black"
            />
          </svg>
        </label>

        <button id="undo" type="button">
          Undo
        </button>

        <button id="redo" type="button">
          Redo
        </button>
      </fieldset>

      <fieldset className="colors">
        <legend>Colors</legend>

        {["#000000", "#ffffff", "#EA4335", "#FBBC05", "#35A402", "#4285F4"].map(
          (color, i) => (
            <label
              key={color}
              id={color === "#ffffff" ? "lineColorWhite" : undefined}
              className={
                selectedTool === "brush" && selectedColor === color
                  ? "active"
                  : ""
              }
            >
              <input
                type="radio"
                name="lineColor"
                value={color}
                checked={selectedTool === "brush" && selectedColor === color}
                readOnly
              />
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20">
                <circle cx="10" cy="10" r="10" fill={color} />
              </svg>
            </label>
          )
        )}

        <label
          className={
            selectedTool === "brush" &&
            ![
              "#000000",
              "#ffffff",
              "#EA4335",
              "#FBBC05",
              "#35A402",
              "#4285F4",
            ].includes(selectedColor)
              ? "active"
              : ""
          }
        >
          <input
            id="lineColorPicker"
            type="color"
            value={selectedColor}
            onChange={(e) => {
              const color = e.target.value;
              lineColorRef.current = color;
              ctxRef.current.globalCompositeOperation = "source-over";
              setSelectedTool("brush");
              setSelectedColor(color);
            }}
          />
        </label>
      </fieldset>

      <button id="clear" type="button">
        Clear canvas
      </button>
    </form>
  );
}
