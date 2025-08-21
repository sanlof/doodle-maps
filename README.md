# 🎨 Doodle Maps

A location-based drawing game that turns the real world into your canvas! Explore designated "Doodle Spots" around Lindholmen, Gothenburg, and create artwork inspired by your surroundings.

## 🎮 How to Play

1. **Pick a Spot!** - The map shows several Doodle Spots that refresh every 30 minutes
2. **Time to Doodle!** - Upon arrival, check out your surroundings and draw what inspires you
3. **Save it!** - Done with your masterpiece? You are ink-credible! Tap Save to share your artwork to the gallery

## ✨ Features

- 🗺️ **Interactive Map** - Find nearby doodle spots with real-time location tracking
- 🎨 **Digital Canvas** - Full-featured drawing tools with customizable brushes and colors
- ⏱️ **Time-based Rotation** - New doodle spots appear every 30 minutes
- 📱 **Mobile-first Design** - Optimized for touch devices and mobile drawing
- 🖼️ **Gallery** - Share and view artwork from other players
- 📍 **Proximity Detection** - Automatically unlock drawing when you reach a spot

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/sanlof/doodle-maps.git
   cd doodle-maps
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory:

   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

## 🏗️ Tech Stack

- **Frontend**: React 18 + Vite
- **Routing**: React Router DOM
- **Database**: Supabase
- **Styling**: CSS3 with custom components
- **Maps & Location**: Web Geolocation API
- **Deployment**: Vercel

## 📁 Project Structure

```
doodle-maps/
├── public/
│   ├── icons/          # UI icons (undo, redo, trash, etc.)
│   └── images/         # App images and doodle examples
├── src/
│   ├── components/     # Reusable components
│   │   ├── CanvasBoard.jsx    # Drawing canvas
│   │   ├── Navbar.jsx         # Navigation
│   │   ├── Toolbar.jsx        # Drawing tools
│   │   └── UploadForm.jsx     # Image upload
│   ├── hooks/          # Custom React hooks
│   │   ├── useCountdown.jsx   # Timer functionality
│   │   └── useProximityRouter.jsx # Location-based routing
│   ├── lib/            # Utilities
│   │   └── supabaseClient.js  # Database client
│   └── pages/          # Route components
│       ├── Home.jsx           # Landing page
│       ├── Map.jsx            # Interactive map
│       ├── Draw.jsx           # Drawing interface
│       ├── Gallery.jsx        # Artwork gallery
│       └── Success.jsx        # Post-upload confirmation
```

## 🎯 Current Doodle Spots

The app currently features spots around Lindholmen, Gothenburg:

- **Filips distans pir** - Waterfront pier
- **Lindholmspiren** - Historic pier location
- **Lindholmsbron** - Bridge viewpoint
- **Karlavagnsplatsen** - Central square
- **Pressbyrån** - Local landmark
- **Gulan** - Popular meeting spot

_Spots rotate automatically every 30 minutes to keep the experience fresh!_

## 🛠️ Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## 🚀 Deployment

This project is configured for deployment on Vercel with automatic SPA routing:

1. Connect your repository to Vercel
2. Set up environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

## 🎨 Credits

Created by student web developers and UX-designers at Yrgo.

Development: Filip Lyrheden and Sandra Löfgren
UX-design: Sarwat Ghalib, Herman Bundy and Amanda Aldenbring

---

_Ready to start doodling? Visit a doodle spot and let your creativity flow!_ 🎨✨
