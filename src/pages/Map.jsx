import React, { useEffect, useRef, useState } from "react";

const PLACES = [
  { title: "Punkt A", lat: 57.7046, lng: 11.965 },
  { title: "Punkt B", lat: 57.706, lng: 11.9695 },
  { title: "Punkt C", lat: 57.7022, lng: 11.9598 },
];

const BOUNDS_RECT = {
  south: 57.698,
  west: 11.952,
  north: 57.709,
  east: 11.975,
};

const POLY_PATH = [
  { lat: 57.709, lng: 11.955 },
  { lat: 57.7065, lng: 11.975 },
  { lat: 57.7005, lng: 11.9725 },
  { lat: 57.699, lng: 11.958 },
];

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
        map = new google.maps.Map(mapRef.current, {
          center: { lat: 57.7046, lng: 11.965 },
          zoom: 14,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          restriction: {
            latLngBounds: BOUNDS_RECT,
            strictBounds: true,
          },
        });

        new google.maps.Rectangle({
          bounds: BOUNDS_RECT,
          map,
          strokeColor: "#1a73e8",
          strokeWeight: 2,
          fillColor: "#1a73e8",
          fillOpacity: 0.08,
        });

        new google.maps.Polygon({
          paths: POLY_PATH,
          map,
          strokeColor: "#e8711a",
          strokeWeight: 2,
          fillColor: "#e8711a",
          fillOpacity: 0.08,
        });

        const info = new google.maps.InfoWindow();
        const bounds = new google.maps.LatLngBounds();

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
          });
          bounds.extend(pos);
        });

        POLY_PATH.forEach((pt) => bounds.extend(pt));
        map.fitBounds(bounds);
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
