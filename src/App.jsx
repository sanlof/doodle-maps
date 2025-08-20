import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Draw from "./pages/Draw.jsx";
import Map from "./pages/Map.jsx";

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
      <Route path="/map" element={<Map />} />
    </Routes>
  );
}
