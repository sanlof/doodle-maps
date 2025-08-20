import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient.js";
import { useNavigate } from "react-router-dom";

export default function UploadForm({ getBlob, onUploaded = () => {} }) {
  const [status, setStatus] = useState("");
  const navigate = useNavigate();
  const goToSuccess = () => {
    navigate("/success");
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setStatus("");

    try {
      setStatus("Judging masterpiece");
      const blob = await getBlob();

      const now = Date.now();
      const filePath = `uploads/${now}.png`;

      setStatus("Uploading drawing…");
      const { error: uploadErr } = await supabase.storage
        .from("paintings")
        .upload(filePath, blob, { contentType: "image/png", upsert: false });
      if (uploadErr) throw uploadErr;

      setStatus("Saving...");
      const { error: dbError } = await supabase.from("paintings_meta").insert({
        file_path: filePath,
        created_at: new Date(now).toISOString(),
      });

      if (dbError) {
        setStatus("Uppladdad, men metadata-fel: " + dbError.message);
      } else {
        setStatus("Drawing saved! ✅");
        goToSuccess();
        onUploaded?.(); // rensa canvas
      }
    } catch (err) {
      console.error(err);
      setStatus("Fel vid uppladdning: " + (err?.message || String(err)));
    }
  };

  return (
    <form id="upload-form" onSubmit={handleUpload}>
      <button id="save-btn" type="submit">
        Save
      </button>
      <div>{status}</div>
    </form>
  );
}
