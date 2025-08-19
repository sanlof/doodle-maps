import React, { useRef } from "react";
import CanvasBoard from "./CanvasBoard.jsx";
import UploadForm from "./UploadForm.jsx";

export default function DrawingPage() {
  const canvasRef = useRef(null);

  return (
    <div className="drawing-page" style={{ display: "grid", gap: "1rem" }}>
      <CanvasBoard ref={canvasRef} />
      <UploadForm getBlob={() => canvasRef.current.getBlob()} />
    </div>
  );
}
