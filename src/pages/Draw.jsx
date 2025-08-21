import CanvasBoard from "../components/CanvasBoard";
import Toolbar from "../components/Toolbar";
import UploadForm from "../components/UploadForm";
import Navbar from "../components/Navbar";
import React, { useRef } from "react";

export default function Draw() {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const lineWidthRef = useRef(2);
  const lineColorRef = useRef("#000000");

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
      <Navbar />
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
