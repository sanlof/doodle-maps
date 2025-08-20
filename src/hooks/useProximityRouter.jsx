import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

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

export default function useProximityRouter(places, radiusMeters = 80) {
  const navigate = useNavigate();
  const navigatedRef = useRef(false);
  const [geoError, setGeoError] = useState(null);
  const [position, setPosition] = useState(null); // {lat, lng, accuracy}

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setGeoError(new Error("Geolocation stöds inte av din webbläsare."));
      return;
    }

    let watchId;

    // (Valfritt) Kolla behörighet – bra för UX
    if (navigator.permissions?.query) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then((res) => {
          // res.state: 'granted' | 'prompt' | 'denied'
          // Du kan visa hint om 'denied' här om du vill.
        })
        .catch(() => {});
    }

    // Starta live-uppdateringar
    watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const curr = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy, // meter
        };
        setPosition(curr);

        if (navigatedRef.current) return;

        // Är vi nära någon plats?
        const nearAny = places.some((p) => {
          const d = distanceMeters(curr, { lat: p.lat, lng: p.lng });
          return d <= radiusMeters;
        });

        if (nearAny) {
          navigatedRef.current = true;
          navigate("/draw");
        }
      },
      (err) => {
        setGeoError(err);
      },
      {
        enableHighAccuracy: true, // bättre precision (kostar mer batteri)
        maximumAge: 5000, // acceptera position max 5s gammal
        timeout: 15000, // ge upp efter 15s
      }
    );

    return () => {
      if (watchId != null) navigator.geolocation.clearWatch(watchId);
    };
  }, [places, radiusMeters, navigate]);

  return { position, geoError };
}
