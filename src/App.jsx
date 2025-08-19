import React, { useRef } from "react";
import CanvasBoard from "./components/CanvasBoard.jsx";
import UploadForm from "./components/UploadForm.jsx";

export default function App() {
  const canvasRef = useRef(null);

  const getBlob = async () => {
    if (!canvasRef.current?.getBlob) {
      throw new Error("Canvas är inte redo ännu.");
    }
    return canvasRef.current.getBlob();
  };

  const clearAfterUpload = () => {
    canvasRef.current?.clear?.();
  };

  return (
    <main
      style={{
        display: "grid",
        gridTemplateRows: "auto 1fr auto",
        gap: "1rem",
        minHeight: "100dvh",
        padding: "1rem",
      }}
    >
      <header>
        <h1>Doodle maps</h1>
      </header>

      <section
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: 8,
          padding: "0.5rem",
          minHeight: "60vh",
          display: "grid",
        }}
      >
        <CanvasBoard ref={canvasRef} />
      </section>

      <footer>
        <UploadForm getBlob={getBlob} onUploaded={clearAfterUpload} />
      </footer>
    </main>
  );
}
