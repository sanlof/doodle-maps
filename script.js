// --- Supabase connection --
import { supabase } from "./supabase.js";

// --- Painting on canvas ---
// const canvas = document.getElementById("drawing-board");
// const toolbar = document.getElementById("toolbar");
// const ctx = canvas.getContext("2d");

// const canvasOffsetX = canvas.offsetLeft;
// const canvasOffsetY = canvas.offsetTop;

// canvas.width = window.innerWidth - canvasOffsetX;
// canvas.height = window.innerHeight - canvasOffsetY;

// let isPainting = false;
// let lineWidth = 5;

// function getXY(e) {
//   if (e.touches) {
//     return {
//       x: e.touches[0].clientX - canvasOffsetX,
//       y: e.touches[0].clientY - canvasOffsetY,
//     };
//   } else {
//     return {
//       x: e.clientX - canvasOffsetX,
//       y: e.clientY - canvasOffsetY,
//     };
//   }
// }

// toolbar.addEventListener("click", (e) => {
//   if (e.target.id === "clear") {
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//   }
// });

// toolbar.addEventListener("change", (e) => {
//   if (e.target.id === "stroke") {
//     ctx.strokeStyle = e.target.value;
//   }
//   if (e.target.id === "lineWidth") {
//     lineWidth = e.target.value;
//   }
// });

// function draw(e) {
//   if (!isPainting) return;
//   e.preventDefault();

//   const { x, y } = getXY(e);

//   ctx.lineWidth = lineWidth;
//   ctx.lineCap = "round";
//   ctx.lineTo(x, y);
//   ctx.stroke();
// }

// function startPainting(e) {
//   isPainting = true;
//   const { x, y } = getXY(e);
//   ctx.beginPath();
//   ctx.moveTo(x, y);
// }

// function stopPainting() {
//   isPainting = false;
//   ctx.stroke();
//   ctx.beginPath();
// }

// canvas.addEventListener("mousedown", startPainting);
// canvas.addEventListener("mouseup", stopPainting);
// canvas.addEventListener("mousemove", draw);

// canvas.addEventListener("touchstart", startPainting);
// canvas.addEventListener("touchend", stopPainting);
// canvas.addEventListener("touchmove", draw);

// --- Upload painting ---
const form = document.getElementById("upload-form");
const fileInput = document.getElementById("file-input");
const nameInput = document.getElementById("name-input");
const status = document.getElementById("status");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const file = fileInput.files[0];
  const name = nameInput.value.trim();
  if (!file || !name) return;

  const filePath = `uploads/${Date.now()}-${file.name}`;

  // Upload file to bucket
  const { data, error } = await supabase.storage
    .from("paintings")
    .upload(filePath, file);

  if (error) {
    console.error(error);
    status.textContent = "Upload error: " + error.message;
    return;
  }

  // Save meta data in table paintings_meta
  const { error: dbError } = await supabase
    .from("paintings_meta")
    .insert({ file_path: filePath, artist_name: name });

  if (dbError) {
    console.error(dbError);
    status.textContent =
      "Painting uploaded but metadata error: " + dbError.message;
  } else {
    status.textContent = "Painting successfully uploaded!";
    form.reset();
  }
});
