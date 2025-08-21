import { supabase } from "../lib/supabaseClient";
import { useEffect, useState } from "react";
import "./Gallery.css";

export default function Gallery() {
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
      <section className="heading">
        <img src="/images/gallery.svg" alt="gallery" id="gallery-heading" />
        <p>Double tap to star a doodle</p>
      </section>
      <section className="buttons">
        <button>My Location</button>
        <button>Show All</button>
      </section>
      <section className="paintings">
        {images.map((url, idx) => (
          <img key={idx} src={url} alt={`Painting ${idx}`} />
        ))}
      </section>
    </section>
  );
}
