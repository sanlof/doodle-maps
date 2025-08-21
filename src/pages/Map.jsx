import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useProximityRouter from "../hooks/useProximityRouter";
import useCountdown from "../hooks/useCountdown";
import Popup from "./Popup";
import "./Map.css";

const PLACES = [
  {
    title: "Filips distans pir",
    lat: 57.703681212214754,
    lng: 11.937960312954232,
  },
  { title: "Lindholmspiren", lat: 57.70586356947422, lng: 11.939951542327886 },
  { title: "Lindholmsbron", lat: 57.706483918887734, lng: 11.94262269881127 },
];

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

// Nästa heltaliga tidsmål baserat på valfritt minutintervall (t.ex. 30)
function getNextTarget(minutes = 30) {
  const now = new Date();
  const next = new Date(now);
  const currentMinutes = now.getMinutes();
  const remainder = currentMinutes % minutes;
  const add = remainder === 0 ? minutes : minutes - remainder;
  next.setSeconds(0, 0);
  next.setMinutes(currentMinutes + add);
  return next;
}

// Väljer platsindex baserat på klockslag
function getPlaceIndexByTime() {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  // 08:00–12:00 => 0
  if (hour >= 8 && (hour < 12 || (hour === 12 && minute === 0))) return 0;
  // 12:01–18:00 => 1
  if (
    (hour === 12 && minute > 0) ||
    (hour > 12 && hour < 18) ||
    (hour === 18 && minute === 0)
  )
    return 1;
  // 18:01–07:59 => 2
  return 2;
}

export default function Map() {
  const navigate = useNavigate();
  const { position, geoError, navigatedRef } = useProximityRouter();

  const mapRef = useRef(null);
  const [error, setError] = useState("");

  const [googleMap, setGoogleMap] = useState(null);
  const currentPlaceMarkerRef = useRef(null);
  const placeCircleRef = useRef(null);

  const [userMarker, setUserMarker] = useState(null);
  const [userCircle, setUserCircle] = useState(null);

  const [currentIndex, setCurrentIndex] = useState(getPlaceIndexByTime());
  const currentPlace = PLACES[currentIndex];

  const lastNavigateTimeRef = useRef(0);

  // Popup state
  const [showPopup, setShowPopup] = useState(false);
  const [popupPlace, setPopupPlace] = useState(null);

  // Nedräkning till nästa 30-minutersgräns
  const [targetDate, setTargetDate] = useState(getNextTarget(30));
  const { formatted, isOver } = useCountdown(targetDate);

  const RADIUS_METERS = 25;

  // Uppdatera platsen varje minut (för tidsbaserad växling)
  useEffect(() => {
    const interval = setInterval(
      () => setCurrentIndex(getPlaceIndexByTime()),
      60_000
    );
    return () => clearInterval(interval);
  }, []);

  // När countdown når noll → växla plats och resetta countdown
  useEffect(() => {
    if (!isOver) return;
    setCurrentIndex((i) => (i + 1) % PLACES.length);
    setTargetDate(getNextTarget(30));
  }, [isOver]);

  // Initiera Google Maps
  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      setError(
        "Lägg till VITE_GOOGLE_MAPS_API_KEY i .env.local för att visa kartan."
      );
      return;
    }

    let isCancelled = false;

    loadGoogleMaps(apiKey)
      .then(() => {
        if (isCancelled) return;
        const google = window.google;
        const map = new google.maps.Map(mapRef.current, {
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
        });

        // Fit bounds till alla PLACES
        const bounds = new google.maps.LatLngBounds();
        PLACES.forEach((p) =>
          bounds.extend(new google.maps.LatLng(p.lat, p.lng))
        );
        map.fitBounds(bounds, 64);

        setGoogleMap(map);
      })
      .catch((e) => {
        console.error(e);
        setError(
          "Kunde inte ladda Google Maps. Kontrollera API-nyckeln och nätverket."
        );
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  // Skapa/uppdatera marker + cirkel för aktuell plats när index ändras
  useEffect(() => {
    if (!googleMap) return;
    const google = window.google;

    // Marker-ikon (SVG inline)
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
</svg>`;

    const center = { lat: currentPlace.lat, lng: currentPlace.lng };

    // Marker
    if (!currentPlaceMarkerRef.current) {
      currentPlaceMarkerRef.current = new google.maps.Marker({
        map: googleMap,
        position: center,
        title: currentPlace.title,
        icon: {
          url:
            "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svgIcon),
          scaledSize: new google.maps.Size(48, 48),
          anchor: new google.maps.Point(24, 24),
        },
      });
      const info = new google.maps.InfoWindow();
      currentPlaceMarkerRef.current.addListener("click", () => {
        info.setContent(
          `<strong>${
            currentPlace.title
          }</strong><br/>${currentPlace.lat.toFixed(
            5
          )}, ${currentPlace.lng.toFixed(5)}`
        );
        info.open(googleMap, currentPlaceMarkerRef.current);
      });
    } else {
      currentPlaceMarkerRef.current.setPosition(center);
      currentPlaceMarkerRef.current.setTitle(currentPlace.title);
    }

    // Cirkel kring aktuell plats
    if (!placeCircleRef.current) {
      placeCircleRef.current = new google.maps.Circle({
        map: googleMap,
        center,
        radius: RADIUS_METERS,
        strokeColor: "#4285F4",
        strokeOpacity: 0.6,
        strokeWeight: 1,
        fillColor: "#4285F4",
        fillOpacity: 0.08,
      });
    } else {
      placeCircleRef.current.setCenter(center);
      placeCircleRef.current.setRadius(RADIUS_METERS);
    }

    // Flytta kartans center lite mjukt mot aktuell plats (utan att förstöra ev. user-view)
    googleMap.panTo(center);
  }, [googleMap, currentIndex]);

  // Rita/uppdatera användarens position och radie + visa popup om nära
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
        strokeColor: "#4285F4",
        strokeOpacity: 0.6,
        strokeWeight: 1,
        fillColor: "#4285F4",
        fillOpacity: 0.1,
      });
      setUserCircle(c);
    } else {
      userCircle.setCenter(latLng);
      userCircle.setRadius(RADIUS_METERS);
    }

    for (const place of PLACES) {
      const distance = distanceMeters(position, place);
      const now = Date.now();
      if (
        distance <= RADIUS_METERS &&
        now - lastNavigateTimeRef.current > 10_000
      ) {
        lastNavigateTimeRef.current = now;
        setPopupPlace(place);
        setShowPopup(true);
        break;
      }
    }
  }, [googleMap, position]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="map-wrap">
      <div className="countdown">
        {isOver
          ? `Ny plats vald: ${currentPlace.title}`
          : `Time remaining to reveal new location: ${formatted}`}
      </div>
      {(error || geoError) && (
        <p role="alert">
          {error
            ? error
            : `Geolocation-fel: ${geoError.message}. Säkerställ HTTPS och ge plats-tillstånd.`}
        </p>
      )}

      <div id="map" ref={mapRef} />

      {/* Knapp för att testa pop-up */}
      {/* <button
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          zIndex: 1100,
          padding: "0.5rem 1rem",
          background: "#4285F4",
          color: "#fff",
          border: "none",
          borderRadius: "0.5rem",
          cursor: "pointer",
        }}
        onClick={() => {
          setPopupPlace(currentPlace);
          setShowPopup(true);
        }}
      >
        Visa popup (test)
      </button> */}

      {showPopup && popupPlace && (
        <div
          className="popup-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <Popup
            title={popupPlace.title}
            onStart={() => {
              setShowPopup(false);
              navigate("/draw");
            }}
          />
        </div>
      )}
    </div>
  );
}

/** Laddar Google Maps JS API en gång */
function loadGoogleMaps(apiKey) {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) return resolve();
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
}
