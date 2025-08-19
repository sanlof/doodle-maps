// App.jsx
import React, { useRef, useState } from "react";
import CanvasBoard from "./components/CanvasBoard.jsx";
import Toolbar from "./components/Toolbar.jsx";

export default function App() {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const lineWidthRef = useRef(5);
  const lineColorRef = useRef("#ff0000");
  const [showMap, setShowMap] = useState(false);

  return (
    <main>
      <Toolbar
        canvasRef={canvasRef}
        ctxRef={ctxRef}
        lineWidthRef={lineWidthRef}
        lineColorRef={lineColorRef}
      />
      <CanvasBoard
        canvasRef={canvasRef}
        ctxRef={ctxRef}
        lineWidthRef={lineWidthRef}
        lineColorRef={lineColorRef}
      />
      <section style={{ marginTop: "1rem" }}>
        <button type="button" onClick={() => setShowMap((v) => !v)}>
          {showMap ? "Dölj karta" : "Visa karta"}
        </button>
      </section>
    </main>
  );
}
