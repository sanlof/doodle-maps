// CanvasBoard.jsx
import React, { useEffect, useRef } from "react";
import "./CanvasBoard.css";

export default function CanvasBoard({
  canvasRef,
  ctxRef,
  lineWidthRef,
  lineColorRef,
}) {
  const isPaintingRef = useRef(false);
  const offsetRef = useRef({ x: 0, y: 0 });

  // Hantera canvas-resize
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctxRef.current = ctx;

    canvas.getBlob = () =>
      new Promise((resolve, reject) => {
        try {
          // PNG (lossless), kan ändras till "image/webp" om du vill
          canvas.toBlob((blob) => {
            if (blob) resolve(blob);
            else reject(new Error("Kunde inte skapa bild från canvas."));
          }, "image/png");
        } catch (err) {
          reject(err);
        }
      });

    canvas.clear = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    const updateOffset = () => {
      const rect = canvas.getBoundingClientRect();
      offsetRef.current = { x: rect.left, y: rect.top };
    };
    updateOffset();

    function resizeCanvasAndOffset() {
      const parent = canvas.parentElement;
      const style = getComputedStyle(parent);
      const width = parseInt(style.width, 10);
      const height = parseInt(style.height, 10);

      // Spara gammal bild
      const old = ctx.getImageData(0, 0, canvas.width, canvas.height);

      canvas.width = width;
      canvas.height = height;

      if (old) ctx.putImageData(old, 0, 0);

      updateOffset();

      ctx.lineCap = "round";
      ctx.strokeStyle = lineColorRef.current;
      ctx.lineWidth = lineWidthRef.current;
    }

    resizeCanvasAndOffset();
    window.addEventListener("resize", resizeCanvasAndOffset);

    return () => window.removeEventListener("resize", resizeCanvasAndOffset);
  }, [canvasRef, ctxRef, lineColorRef, lineWidthRef]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;

    const getXY = (e) => {
      if (e.touches && e.touches[0]) {
        return {
          x: e.touches[0].clientX - offsetRef.current.x,
          y: e.touches[0].clientY - offsetRef.current.y,
        };
      }
      return {
        x: e.clientX - offsetRef.current.x,
        y: e.clientY - offsetRef.current.y,
      };
    };

    const draw = (e) => {
      if (!isPaintingRef.current) return;
      e.preventDefault();
      const { x, y } = getXY(e);
      ctx.lineWidth = lineWidthRef.current;
      ctx.strokeStyle = lineColorRef.current;
      ctx.lineCap = "round";
      ctx.lineTo(x, y);
      ctx.stroke();
    };

    const startPainting = (e) => {
      isPaintingRef.current = true;
      const { x, y } = getXY(e);
      ctx.beginPath();
      ctx.moveTo(x, y);
    };

    const stopPainting = () => {
      isPaintingRef.current = false;
      ctx.stroke();
      ctx.beginPath();
    };

    canvas.addEventListener("mousedown", startPainting);
    canvas.addEventListener("mouseup", stopPainting);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseleave", stopPainting);
    canvas.addEventListener("touchstart", startPainting, { passive: false });
    canvas.addEventListener("touchend", stopPainting);
    canvas.addEventListener("touchmove", draw, { passive: false });

    return () => {
      canvas.removeEventListener("mousedown", startPainting);
      canvas.removeEventListener("mouseup", stopPainting);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseleave", stopPainting);
      canvas.removeEventListener("touchstart", startPainting);
      canvas.removeEventListener("touchend", stopPainting);
      canvas.removeEventListener("touchmove", draw);
    };
  }, [canvasRef, ctxRef, lineWidthRef, lineColorRef]);

  return <canvas ref={canvasRef} className="canvas-board" />;
}
