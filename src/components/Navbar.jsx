import React from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar({ backPath }) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backPath) {
      navigate(backPath);
    } else {
      navigate(-1); // go back to previous page
    }
  };

  return (
    <nav className="navbar">
      <button className="back-btn" onClick={handleBack}></button>
    </nav>
  );
}
