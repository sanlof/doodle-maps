const canvas = document.getElementById('drawing-board');
const toolbar = document.getElementById('toolbar');

if (canvas && toolbar) {
  const ctx = canvas.getContext('2d');
  const canvasOffsetX = canvas.offsetLeft;
  const canvasOffsetY = canvas.offsetTop;

  const drawingBoard = canvas.parentElement;
  if (drawingBoard) {
    canvas.width = drawingBoard.clientWidth;
    canvas.height = drawingBoard.clientHeight;
  }

  let isPainting = false;
  let lineWidth = 5;

  function getXY(e) {
    if (e.touches) {
      return {
        x: e.touches[0].clientX - canvasOffsetX,
        y: e.touches[0].clientY - canvasOffsetY
      };
    } else {
      return {
        x: e.clientX - canvasOffsetX,
        y: e.clientY - canvasOffsetY
      };
    }
  }

  toolbar.addEventListener('click', e => {
    if (e.target.id === 'clear') {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  });

  toolbar.addEventListener('change', e => {
    if (e.target.id === 'stroke') ctx.strokeStyle = e.target.value;
    if (e.target.id === 'lineWidth') lineWidth = e.target.value;
  });

  function draw(e) {
    if (!isPainting) return;
    e.preventDefault();
    const { x, y } = getXY(e);
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  function startPainting(e) {
    isPainting = true;
    const { x, y } = getXY(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  function stopPainting() {
    isPainting = false;
    ctx.stroke();
    ctx.beginPath();
  }

  const saveBtn = document.getElementById('save');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const dataURL = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = 'drawing.png';
      link.click();
    });
  }

  canvas.addEventListener('mousedown', startPainting);
  canvas.addEventListener('mouseup', stopPainting);
  canvas.addEventListener('mousemove', draw);

  canvas.addEventListener('touchstart', startPainting, { passive: false });
  canvas.addEventListener('touchend', stopPainting);
  canvas.addEventListener('touchmove', draw, { passive: false });
}


/***** GOOGLE MAPS *****/

const PLACES = [
  { title: "Punkt A", lat: 57.7046, lng: 11.9650 },
  { title: "Punkt B", lat: 57.7060, lng: 11.9695 },
  { title: "Punkt C", lat: 57.7022, lng: 11.9598 },
];

const BOUNDS_RECT = {
  south: 57.698, west: 11.952,
  north: 57.709, east: 11.975
};

const POLY_PATH = [
  { lat: 57.7090, lng: 11.9550 },
  { lat: 57.7065, lng: 11.9750 },
  { lat: 57.7005, lng: 11.9725 },
  { lat: 57.6990, lng: 11.9580 },
];

window.initMap = function initMap() {
  const mapEl = document.getElementById("map");
  const map = new google.maps.Map(mapEl, {
    center: { lat: 57.7046, lng: 11.9650 },
    zoom: 14,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true,
  });

  map.setOptions({
    restriction: {
      latLngBounds: BOUNDS_RECT,
      strictBounds: true
    },
    minZoom: 12
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

  PLACES.forEach(p => {
    const pos = { lat: p.lat, lng: p.lng };
    const marker = new google.maps.Marker({ position: pos, map, title: p.title });
    marker.addListener("click", () => {
      info.setContent(`<strong>${p.title}</strong><br/>${p.lat.toFixed(5)}, ${p.lng.toFixed(5)}`);
      info.open(map, marker);
    });
    bounds.extend(pos);
  });

  let finalBounds = bounds.union(
    new google.maps.LatLngBounds(
      { lat: BOUNDS_RECT.south, lng: BOUNDS_RECT.west },
      { lat: BOUNDS_RECT.north, lng: BOUNDS_RECT.east }
    )
  );
  POLY_PATH.forEach(pt => finalBounds.extend(pt));

  map.fitBounds(finalBounds);
};

