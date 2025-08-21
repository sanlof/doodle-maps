import { supabase } from "../lib/supabaseClient";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useLocation } from "react-router-dom";
import "./Gallery.css";

export default function Gallery() {
  const location = useLocation();
  const from = location.state?.from;
  let backPath;

  if (from === "home") backPath = "/";
  else if (from === "success") backPath = "/map";
  else backPath = "/";

  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      const { data, error } = await supabase.storage
        .from("paintings")
        .list("uploads", { sortBy: { column: "created_at", order: "desc" } });
      if (error) return console.error(error);

      const urls = data.map((file) => {
        const { publicUrl } = supabase.storage
          .from("paintings")
          .getPublicUrl(`uploads/${file.name}`).data;
        return publicUrl;
      });

      setImages(urls);
    };

    fetchImages();
  }, []);

  return (
    <section className="gallery">
      <Navbar backPath={backPath} />
      <section className="heading">
        <img src="/images/gallery.svg" alt="gallery" id="gallery-heading" />
        <p>Double tap to star a doodle</p>
      </section>
      <section className="buttons">
        <button className="my-location">My Location</button>
        <button className="show-all">Show All</button>
      </section>
      <section className="paintings">
        {images.map((url, idx) => (
          <img key={idx} src={url} alt={`Painting ${idx}`} />
        ))}
      </section>
    </section>
  );
}
