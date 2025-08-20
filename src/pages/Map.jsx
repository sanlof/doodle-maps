import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const PLACES = [
  { title: "Gulan", lat: 57.706083, lng: 11.936422 },
  { title: "Färjeläget", lat: 57.705747, lng: 11.939973 },
  { title: "Alkemisten", lat: 57.708575, lng: 11.939821 },
];

const BOUNDS_RECT = {
  south: 57.701662,
  west: 11.926414,
  north: 57.712025,
  east: 11.942035,
};

// Helper to load Google Maps script once
function loadGoogleMaps(apiKey) {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) return resolve();
    const existing = document.querySelector("script[data-gmaps]");
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", reject);
      return;
    }
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.defer = true;
    script.setAttribute("data-gmaps", "1");
    script.onload = () => resolve();
    script.onerror = (e) => reject(e);
    document.head.appendChild(script);
  });
}

export default function Map() {
  const mapRef = useRef(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      setError(
        "Lägg till VITE_GOOGLE_MAPS_API_KEY i .env.local för att visa kartan."
      );
      return;
    }

    let map;
    loadGoogleMaps(apiKey)
      .then(() => {
        const google = window.google;

        // 1) Skapa bounds från PLACES
        const bounds = new google.maps.LatLngBounds();
        PLACES.forEach((p) => bounds.extend({ lat: p.lat, lng: p.lng }));

        // 2) Initiera kartan (center/zoom spelar mindre roll – vi kör fitBounds direkt efter)
        map = new google.maps.Map(mapRef.current, {
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
        });

        // 3) Markers + InfoWindow
        const info = new google.maps.InfoWindow();
        PLACES.forEach((p) => {
          const pos = { lat: p.lat, lng: p.lng };
          const marker = new google.maps.Marker({
            position: pos,
            map,
            title: p.title,
          });
          marker.addListener("click", () => {
            info.setContent(
              `<strong>${p.title}</strong><br/>${p.lat.toFixed(
                5
              )}, ${p.lng.toFixed(5)}`
            );
            info.open(map, marker);
            // Navigera till en route för platsen
            navigate(`/draw`);
          });
        });

        // 4) Valfri buffer runt rektangeln så den inte klibbar mot kanterna
        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();
        const margin = 0.005; // ~150 m beroende på latitud, justera efter behov
        const rectBounds = {
          north: ne.lat() + margin,
          east: ne.lng() + margin,
          south: sw.lat() - margin,
          west: sw.lng() - margin,
        };

        // 5) Rita rektangeln baserat på PLACES
        new google.maps.Rectangle({
          bounds: rectBounds, // kan även vara direkt `bounds`
          map,
          strokeColor: "#1a73e8",
          strokeWeight: 2,
          fillColor: "#1a73e8",
          fillOpacity: 0.08,
          clickable: false,
        });

        // 6) Zooma/panorera så allt syns, med padding
        map.fitBounds(bounds, {
          top: 80,
          right: 80,
          bottom: 80,
          left: 80,
        });

        // 7) (Valfritt) Begränsa panorering till samma yta
        map.setOptions({
          restriction: {
            latLngBounds: rectBounds, // eller `bounds.toJSON()`
            strictBounds: true,
          },
        });
      })
      .catch((e) => {
        console.error(e);
        setError(
          "Kunde inte ladda Google Maps. Kontrollera API-nyckeln och nätverket."
        );
      });

    return () => {};
  }, []);

  return (
    <div>
      {error && <p role="alert">{error}</p>}
      <div id="map" ref={mapRef} />
    </div>
  );
}
