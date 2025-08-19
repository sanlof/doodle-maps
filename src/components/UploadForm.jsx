import React, { useRef, useState } from 'react'
import { supabase } from '../lib/supabaseClient.js'

export default function UploadForm() {
  const fileRef = useRef(null)
  const nameRef = useRef(null)
  const [status, setStatus] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setStatus('')

    const file = fileRef.current?.files?.[0]
    const name = (nameRef.current?.value || '').trim()
    if (!file || !name) {
      setStatus('Välj en bildfil och skriv in ditt namn.')
      return
    }

    try {
      const filePath = `uploads/${Date.now()}-${file.name}`
      const { error: uploadErr } = await supabase
        .storage.from('paintings').upload(filePath, file)

      if (uploadErr) throw uploadErr

      const { error: dbError } = await supabase
        .from('paintings_meta')
        .insert({ file_path: filePath, artist_name: name })

      if (dbError) {
        setStatus('Uppladdad, men metadata-fel: ' + dbError.message)
      } else {
        setStatus('Målningen uppladdad!')
        if (e.target instanceof HTMLFormElement) e.target.reset()
      }
    } catch (err) {
      console.error(err)
      setStatus('Fel vid uppladdning: ' + (err?.message || String(err)))
    }
  }

  return (
    <div className="upload">
      <form id="upload-form" onSubmit={onSubmit}>
        <input type="file" id="file-input" ref={fileRef} accept="image/*" required />
        <input type="text" id="name-input" ref={nameRef} placeholder="Ditt namn" required />
        <button type="submit">Ladda upp</button>
      </form>
      <div id="status" aria-live="polite" style={{ marginTop: '0.5rem' }}>{status}</div>
    </div>
  )
}
