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
    <main>
      <h1>Doodle maps</h1>
      <CanvasBoard ref={canvasRef} />
      <UploadForm getBlob={getBlob} onUploaded={clearAfterUpload} />
    </main>
  );
}
