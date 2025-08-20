import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useProximityRouter from "../hooks/useProximityRouter";

// --- PLACES & helpers (din befintliga lista) ---
const PLACE = { title: "Gulan", lat: 57.706083, lng: 11.936422 };
const PLACES = [PLACE];

function distanceMeters(a, b) {
  const R = 6371e3; // jordradie i meter
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  return 2 * R * Math.asin(Math.sqrt(h));
}

export default function Map() {
  const mapRef = useRef(null);
  const [error, setError] = useState("");
  const [googleMap, setGoogleMap] = useState(null);
  const [userMarker, setUserMarker] = useState(null);
  const [userCircle, setUserCircle] = useState(null);

  // Starta geofencing som navigerar när man är nära
  const RADIUS_METERS = 50; // justera efter behov
  const { position, geoError } = useProximityRouter(PLACES, RADIUS_METERS);
  const navigatedRef = useRef(false);
  const navigate = useNavigate();

  // Dynamisk laddning av Google Maps-script
  function loadGoogleMaps(apiKey) {
    return new Promise((resolve, reject) => {
      if (window.google && window.google.maps) {
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
      script.async = true;
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  }

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
        const bounds = new google.maps.LatLngBounds();
        PLACES.forEach((p) => bounds.extend({ lat: p.lat, lng: p.lng }));

        map = new google.maps.Map(mapRef.current, {
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
        });

        // Markers & info
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
          });
        });

        map.setCenter({ lat: PLACE.lat, lng: PLACE.lng });
        map.setZoom(17);

        // Rita cirkel kring platsen
        new google.maps.Circle({
          map,
          center: { lat: PLACE.lat, lng: PLACE.lng },
          radius: RADIUS_METERS,
          strokeOpacity: 0.6,
          strokeWeight: 1,
          fillOpacity: 0.08,
        });

        setGoogleMap(map);
      })
      .catch((e) => {
        console.error(e);
        setError(
          "Kunde inte ladda Google Maps. Kontrollera API-nyckeln och nätverket."
        );
      });
  }, []);

  // Rita/uppdatera användarens position och radie
  useEffect(() => {
    if (!googleMap || !position) return;
    const google = window.google;

    const latLng = new google.maps.LatLng(position.lat, position.lng);

    if (!userMarker) {
      const m = new google.maps.Marker({
        map: googleMap,
        position: latLng,
        title: "Du är här",
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 6,
          fillColor: "#4285F4",
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: "#fff",
        },
      });
      setUserMarker(m);
    } else {
      userMarker.setPosition(latLng);
    }

    if (!userCircle) {
      const c = new google.maps.Circle({
        map: googleMap,
        center: latLng,
        radius: RADIUS_METERS,
        strokeOpacity: 0.6,
        strokeWeight: 1,
        fillOpacity: 0.1,
      });
      setUserCircle(c);
    } else {
      userCircle.setCenter(latLng);
      userCircle.setRadius(RADIUS_METERS);
    }

    // Kontrollera avstånd och navigera vid behov
    PLACES.forEach((place) => {
      const distance = distanceMeters(position, place);
      if (distance <= RADIUS_METERS && !navigatedRef.current) {
        navigatedRef.current = true;
        navigate("/draw");
      }
    });
  }, [googleMap, position]);

  return (
    <div>
      {(error || geoError) && (
        <p role="alert">
          {error ||
            `Geolocation-fel: ${geoError.message}. Säkerställ HTTPS och ge plats-tillstånd.`}
        </p>
      )}
      <div id="map" ref={mapRef} />
    </div>
  );
}
