# Doodle Maps (React + Vite)

Den här mappen är en konvertering av ditt vanilla-projekt till **React + Vite**.

## Kom igång

1. Installera beroenden:
   ```bash
   npm i
   ```

2. Kopiera `.env.example` till `.env.local` och fyll i nycklarna:
   ```bash
   cp .env.example .env.local
   # öppna .env.local och fyll i:
   # VITE_SUPABASE_URL=...
   # VITE_SUPABASE_ANON_KEY=...
   # VITE_GOOGLE_MAPS_API_KEY=... (valfritt – bara om du vill visa kartan)
   ```

3. Starta dev-servern:
   ```bash
   npm run dev
   ```

4. Bygg för produktion:
   ```bash
   npm run build
   npm run preview
   ```

## Var finns vad?

- **Canvas & rita**: `src/components/CanvasBoard.jsx` (kopplar ihop med knapparna i `App.jsx`)
- **Ladda upp till Supabase**: `src/components/UploadForm.jsx` och `src/lib/supabaseClient.js`
- **Google Maps** (valfritt): `src/components/Map.jsx` – kräver `VITE_GOOGLE_MAPS_API_KEY`

## Nycklar och säkerhet

- Lägg *aldrig* hemliga nycklar i klientkoden. Med Vite läses nycklar från `.env.local` via `import.meta.env.VITE_*`.
- Supabase **anon**-nyckeln är avsedd att användas i klienten, men se till att dina **RLS policies** i Supabase begränsar rättigheter.
- För Google Maps kan du i Google Cloud Console begränsa användningen av API-nyckeln till specifika ursprung (t.ex. `http://localhost:*` under utveckling och din produktionsdomän).

## Skillnader mot originalet

- Inline `<script>`-taggen för Google Maps ersätts med en dynamisk laddning i `Map.jsx`.
- Supabase-klienten läser URL samt anon-nyckel från `.env.local`.
- Stilarna från `style.css` är portade till `src/index.css`.
- Canvas-beteendet och spara-knappen är detsamma som tidigare.

Lycka till! ✨
