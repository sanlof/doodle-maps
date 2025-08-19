import React, {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
  useState,
} from "react";

const CanvasBoard = forwardRef(function CanvasBoard(_, ref) {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const isPaintingRef = useRef(false);
  const lineWidthRef = useRef(5);
  const offsetRef = useRef({ x: 0, y: 0 });

  const [stroke, setStroke] = useState("#000000");
  const [lineWidth, setLineWidth] = useState(5);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { willReadFrequently: false });
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
      ctx.lineCap = "round";
      ctx.strokeStyle = stroke;
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
  }, [stroke]);

  useImperativeHandle(ref, () => ({
    async getBlob() {
      const canvas = canvasRef.current;
      return await new Promise((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error("Kunde inte skapa PNG från canvas."));
          },
          "image/png",
          1.0
        );
      });
    },
    clear() {
      const canvas = canvasRef.current;
      const ctx = ctxRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    },
  }));

  return (
    <div
      className="drawing-area"
      style={{ width: "100%", height: "60vh", display: "grid", gap: "0.5rem" }}
    >
      <div
        className="toolbar"
        style={{
          display: "flex",
          gap: "0.5rem",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <label htmlFor="stroke">Color</label>
        <input
          id="stroke"
          type="color"
          value={stroke}
          onChange={(e) => setStroke(e.target.value)}
        />
        <label htmlFor="lineWidth">Pen width</label>
        <input
          id="lineWidth"
          type="number"
          min={1}
          max={64}
          value={lineWidth}
          onChange={(e) => {
            const v = Number(e.target.value || 5);
            setLineWidth(v);
            lineWidthRef.current = v;
          }}
          style={{ width: 80 }}
        />
        <button type="button" onClick={() => ref?.current?.clear?.()}>
          Rensa
        </button>
      </div>

      <div
        className="board"
        style={{ width: "100%", height: "100%", border: "1px solid #ddd" }}
      >
        <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
      </div>
    </div>
  );
});

export default CanvasBoard;
