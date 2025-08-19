import React, { useRef, useState } from "react";
import CanvasBoard from "./components/CanvasBoard.jsx";
import UploadForm from "./components/UploadForm.jsx";
import Toolbar from "./components/Toolbar.jsx";

export default function App() {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const lineWidthRef = useRef(5);
  const lineColorRef = useRef("#ff0000");

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
    <main>
      <h1>Doodle maps</h1>
      <CanvasBoard
        canvasRef={canvasRef}
        ctxRef={ctxRef}
        lineWidthRef={lineWidthRef}
        lineColorRef={lineColorRef}
      />
      <Toolbar
        canvasRef={canvasRef}
        ctxRef={ctxRef}
        lineWidthRef={lineWidthRef}
        lineColorRef={lineColorRef}
      />
      <UploadForm getBlob={getBlob} onUploaded={clearAfterUpload} />
    </main>
  );
}
