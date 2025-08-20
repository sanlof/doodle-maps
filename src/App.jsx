import React, { useRef, useState } from "react";
import CanvasBoard from "./components/CanvasBoard.jsx";
import UploadForm from "./components/UploadForm.jsx";
import Toolbar from "./components/Toolbar.jsx";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Draw from "./pages/Draw.jsx";
import Gallery from "./pages/Gallery.jsx";

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <Home />
          </>
        }
      />
      <Route path="/draw" element={<Draw />} />
      <Route path="/gallery" element={<Gallery />} />
    </Routes>
  );
}
