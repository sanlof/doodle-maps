import React, { useState } from 'react'
import CanvasBoard from './components/CanvasBoard.jsx'
import UploadForm from './components/UploadForm.jsx'
import Map from './components/Map.jsx'

export default function App() {
  const [showMap, setShowMap] = useState(false)

  return (
    <main>
      <h1>Draw</h1>
      <section className="drawing-area">
        <div className="drawing-board">
          <CanvasBoard />
        </div>
        <div id="toolbar">
          <label htmlFor="stroke">Stroke</label>
          <input id="stroke" name="stroke" type="color" />
          <label htmlFor="lineWidth">Line Width</label>
          <input id="lineWidth" name="lineWidth" type="number" defaultValue={5} />
          <button id="clear" type="button">Clear</button>
          <button id="save" type="button">Save</button>
        </div>
      </section>

      <section className="upload" style={{ marginTop: '1rem' }}>
        <UploadForm />
      </section>

      <section style={{ marginTop: '1rem' }}>
        <button type="button" onClick={() => setShowMap(v => !v)}>
          {showMap ? 'Dölj karta' : 'Visa karta'}
        </button>
        {showMap && <div style={{ marginTop: '0.75rem' }}><Map /></div>}
      </section>
    </main>
  )
}
