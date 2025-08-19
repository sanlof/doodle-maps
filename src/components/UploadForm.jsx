import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient.js";

export default function UploadForm({ getBlob }) {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");

  const handleUpload = async (e) => {
    e.preventDefault();
    setStatus("");

    const trimmed = name.trim();
    if (!trimmed) {
      setStatus("Skriv in ditt namn först.");
      return;
    }

    try {
      setStatus("Judging masterpiece");
      const blob = await getBlob();

      const filePath = `uploads/${Date.now()}.png`;

      setStatus("Uploading drawing…");
      const { error: uploadErr } = await supabase.storage
        .from("paintings")
        .upload(filePath, blob, { contentType: "image/png", upsert: false });

      if (uploadErr) throw uploadErr;

      setStatus("Saving...");
      const { error: dbError } = await supabase
        .from("paintings_meta")
        .insert({ file_path: filePath, artist_name: trimmed });

      if (dbError) {
        setStatus("Uppladdad, men metadata-fel: " + dbError.message);
      } else {
        setStatus("Drawing saved! ✅");
      }
    } catch (err) {
      console.error(err);
      setStatus("Fel vid uppladdning: " + (err?.message || String(err)));
    }
  };

  return (
    <form
      onSubmit={handleUpload}
      style={{
        display: "flex",
        gap: "0.5rem",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <input
        type="text"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        style={{ flex: "1 1 220px" }}
      />
      <button type="submit">Ladda upp</button>
      <div aria-live="polite" style={{ width: "100%" }}>
        {status}
      </div>
    </form>
  );
}
