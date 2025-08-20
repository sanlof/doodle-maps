import { Routes, Route, Navigate } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Draw from "./pages/Draw.jsx";
import Success from "./pages/Success.jsx";
import Gallery from "./pages/Gallery.jsx";
import Map from "./pages/Map.jsx";

export default function App() {
  return (
    <BrowserRouter>
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
        <Route path="/success" element={<Success />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/map" element={<Map />} />
      </Routes>
    </BrowserRouter>
  );
}
