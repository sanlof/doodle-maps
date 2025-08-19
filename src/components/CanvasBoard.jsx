// CanvasBoard.jsx
import React, { useEffect, useRef } from "react";

export default function CanvasBoard({
  canvasRef,
  ctxRef,
  lineWidthRef,
  lineColorRef,
}) {
  const isPaintingRef = useRef(false);
  const offsetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctxRef.current = ctx;

    const parent = canvas.parentElement;
    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;

    const updateOffset = () => {
      const rect = canvas.getBoundingClientRect();
      offsetRef.current = { x: rect.left, y: rect.top };
    };
    updateOffset();
    window.addEventListener("resize", updateOffset);

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
      window.removeEventListener("resize", updateOffset);
      canvas.removeEventListener("mousedown", startPainting);
      canvas.removeEventListener("mouseup", stopPainting);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseleave", stopPainting);
      canvas.removeEventListener("touchstart", startPainting);
      canvas.removeEventListener("touchend", stopPainting);
      canvas.removeEventListener("touchmove", draw);
    };
  }, [canvasRef, ctxRef, lineWidthRef, lineColorRef]);

  return <canvas ref={canvasRef} style={{ border: "1px solid black" }} />;
}
