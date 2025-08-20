import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useProximityRouter from "../hooks/useProximityRouter";

const PLACE = { title: "Gulan", lat: 57.706083, lng: 11.936422 };
const PLACES = [PLACE];

function distanceMeters(a, b) {
  const R = 6371e3;
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
  const RADIUS_METERS = 25; // justera efter behov
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

        const svgIcon = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <g clip-path="url(#clip0_155_640)">
    <path d="M12 2C17.498 2 22 6.002 22 11C22 12.351 21.4 13.64 20.346 14.576C19.316 15.49 17.934 16 16.5 16H13.984C13.7609 15.9964 13.5431 16.0675 13.3651 16.202C13.1871 16.3365 13.0591 16.5266 13.0017 16.7422C12.9442 16.9578 12.9604 17.1864 13.0478 17.3916C13.1352 17.5969 13.2888 17.767 13.484 17.875C13.554 17.9137 13.6192 17.9607 13.678 18.015C14.0204 18.331 14.2588 18.7435 14.3616 19.198C14.4644 19.6524 14.4267 20.1274 14.2535 20.56C14.0804 20.9925 13.78 21.3623 13.392 21.6204C13.0041 21.8784 12.5469 22.0125 12.081 22.005L11.925 21.996L11.993 22L11.72 21.996C6.42 21.85 2.15 17.58 2.004 12.28L2 12C2 6.477 6.477 2 12 2ZM8.5 8.5C7.99542 8.49984 7.50943 8.69041 7.13945 9.0335C6.76947 9.37659 6.54284 9.84685 6.505 10.35L6.5 10.5C6.5 10.8956 6.6173 11.2822 6.83706 11.6111C7.05682 11.94 7.36918 12.1964 7.73463 12.3478C8.10009 12.4991 8.50222 12.5387 8.89018 12.4616C9.27814 12.3844 9.63451 12.1939 9.91421 11.9142C10.1939 11.6345 10.3844 11.2781 10.4616 10.8902C10.5387 10.5022 10.4991 10.1001 10.3478 9.73463C10.1964 9.36918 9.94004 9.05682 9.61114 8.83706C9.28224 8.6173 8.89556 8.5 8.5 8.5ZM16.5 8.5C15.9954 8.49984 15.5094 8.69041 15.1395 9.0335C14.7695 9.37659 14.5428 9.84685 14.505 10.35L14.5 10.5C14.5 10.8956 14.6173 11.2822 14.8371 11.6111C15.0568 11.94 15.3692 12.1964 15.7346 12.3478C16.1001 12.4991 16.5022 12.5387 16.8902 12.4616C17.2781 12.3844 17.6345 12.1939 17.9142 11.9142C18.1939 11.6345 18.3844 11.2781 18.4616 10.8902C18.5387 10.5022 18.4991 10.1001 18.3478 9.73463C18.1964 9.36918 17.94 9.05682 17.6111 8.83706C17.2822 8.6173 16.8956 8.5 16.5 8.5ZM12.5 5.5C11.9954 5.49984 11.5094 5.69041 11.1395 6.0335C10.7695 6.37659 10.5428 6.84684 10.505 7.35L10.5 7.5C10.5 7.89556 10.6173 8.28224 10.8371 8.61114C11.0568 8.94004 11.3692 9.19638 11.7346 9.34776C12.1001 9.49913 12.5022 9.53874 12.8902 9.46157C13.2781 9.3844 13.6345 9.19392 13.9142 8.91421C14.1939 8.63451 14.3844 8.27814 14.4616 7.89018C14.5387 7.50222 14.4991 7.10009 14.3478 6.73463C14.1964 6.36918 13.94 6.05682 13.6111 5.83706C13.2822 5.6173 12.8956 5.5 12.5 5.5Z" fill="black"/>
  </g>
  <defs>
    <clipPath id="clip0_155_640">
      <rect width="24" height="24" fill="white"/>
    </clipPath>
  </defs>
</svg>
`;

        // Markers & info
        const info = new google.maps.InfoWindow();
        PLACES.forEach((p) => {
          const pos = { lat: p.lat, lng: p.lng };
          const marker = new google.maps.Marker({
            position: pos,
            map,
            title: p.title,
            icon: {
              url:
                "data:image/svg+xml;charset=UTF-8," +
                encodeURIComponent(svgIcon),
              scaledSize: new google.maps.Size(48, 48),
              anchor: new google.maps.Point(24, 24),
            },
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

    // Kontrollera avstånd och routing till draw-sida
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
