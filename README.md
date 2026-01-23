# TradeOut - Retro Apple Trade Guessing Game

A casual trade-geography guessing game inspired by Tradle, wrapped in a stylized retro Apple (classic Macintosh) UI with cozy, nostalgic game aesthetics.

## 🎮 How to Play

1. You'll see a treemap visualization of a mystery country's export products
2. Each colored block represents an export product, sized by its share of total exports
3. Guess which country it is - you have 6 attempts!
4. After each guess, you'll see:
   - **Distance**: How far your guess is from the target
   - **Direction**: Arrow pointing toward the target country
   - **Proximity %**: Color-coded closeness (red = far, green = close)
5. Use the clues to narrow down the correct country!

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or pnpm

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser to play!

## 🎨 Features

- **Custom SVG Treemap**: Hand-built treemap visualization with full styling control
- **Retro Mac UI**: Classic Macintosh window styling with nostalgic aesthetics
- **Fuzzy Autocomplete**: Smart country name matching with support for common aliases (USA, UK, etc.)
- **Geographic Feedback**: Distance, direction, and proximity percentage for each guess
- **Random Puzzles**: Each game features a different country with no-repeat logic
- **Sound Effects**: Optional retro Mac-style sounds (muted by default)
- **Responsive Design**: Works on desktop and mobile (desktop-first)
- **Pure Client-Side**: No backend required, all data bundled statically

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (TypeScript)
- **Styling**: Tailwind CSS with custom retro theme
- **UI Components**: Shadcn UI (customized)
- **Fonts**: VT323 (pixel font for retro aesthetic)
- **Data**: Static JSON (~100 countries with real export data)

## 📁 Project Structure

```
tradeout/
├── app/                      # Next.js app directory
│   ├── layout.tsx           # Root layout with fonts
│   ├── page.tsx             # Main game page
│   └── globals.css          # Global styles & retro theme
├── components/              # React components
│   ├── DesktopPattern.tsx   # Background pattern
│   ├── RetroWindow.tsx      # Mac window frame
│   ├── TitleBar.tsx         # Window title bar
│   ├── Treemap.tsx          # SVG treemap visualization
│   ├── GuessInput.tsx       # Input with autocomplete
│   ├── GuessList.tsx        # Guess history display
│   └── ...                  # Other game components
├── hooks/                   # Custom React hooks
│   ├── useGameState.ts      # Game logic & state
│   ├── useSounds.ts         # Sound effects
│   └── useFirstVisit.ts     # First-time help modal
├── lib/
│   ├── data/
│   │   └── countries.ts     # Country export data
│   └── utils/               # Utility functions
│       ├── geo.ts           # Distance & direction calculations
│       ├── fuzzy.ts         # Fuzzy name matching
│       ├── puzzle.ts        # Random selection logic
│       └── treemap.ts       # Treemap algorithm
└── public/
    └── sounds/              # Sound effect files
```

## 🎯 Game Mechanics

- **6 Attempts**: You have 6 guesses to identify the country
- **No-Repeat Logic**: Last 20 countries are excluded from random selection
- **Proximity Scoring**: Based on geographic distance (20,000km = 0%, 0km = 100%)
- **8-Direction Compass**: Arrows point N, NE, E, SE, S, SW, W, or NW
- **Alias Support**: Common abbreviations work (USA, UK, Holland, etc.)

## 🎨 Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Cream | #F5F0E8 | Main background |
| Warm Gray | #D4CFC7 | Panels, cards |
| Dusty Pink | #E8B4B4 | Treemap (agriculture) |
| Sage Green | #B8C5B0 | Treemap (food, electronics) |
| Powder Blue | #B0C9D4 | Treemap (energy) |
| Warm Sand | #D9C9A8 | Treemap (minerals) |

## 📝 Data Source

Export data sourced from [OEC (Observatory of Economic Complexity)](https://oec.world/), featuring ~100 countries with distinctive export profiles.

## 🔊 Sound Effects

Sound files are located in `public/sounds/`. Replace the placeholder files with actual retro Mac-style sound effects:

- `key-click.mp3` - Typing sound
- `submit.mp3` - Button press sound
- `wrong-beep.mp3` - Incorrect guess sound
- `win-chime.mp3` - Victory sound

Find free sounds at:
- https://freesound.org/
- https://pixabay.com/sound-effects/
- https://mixkit.co/free-sound-effects/

## 🚢 Deployment

This is a static Next.js app that can be deployed to:

- **Vercel** (recommended): `vercel --prod`
- **Netlify**: Configure as Next.js site
- **Any static hosting**: `npm run build` → deploy `.next` folder

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

## 🎮 Customization

### Adding Countries

Edit `lib/data/countries.ts` to add more countries. Each country needs:

```typescript
{
  name: 'Country Name',
  iso: 'XX',           // 2-letter ISO code
  flag: '🇽🇽',          // Flag emoji
  lat: 0.0,            // Latitude
  lng: 0.0,            // Longitude
  aliases: ['...'],    // Alternative names
  totalExports: 0,     // Total export value (millions USD)
  exports: [           // Top export products
    {
      name: 'Product',
      value: 0,        // Export value (millions USD)
      percentage: 0,   // Percentage of total
      sector: '...'    // Sector category
    }
  ]
}
```

### Customizing Theme

Edit `tailwind.config.ts` to modify colors, fonts, or spacing. The retro theme colors are defined in the `extend.colors.retro` section.

### Modifying Game Rules

- **Max guesses**: Change `MAX_GUESSES` in `hooks/useGameState.ts`
- **History size**: Change `MAX_HISTORY` in same file
- **Min treemap label size**: Edit `minArea` in `lib/utils/treemap.ts`

## 📄 License

This project is open source. Export data is from OEC World under their respective terms.

## 🙏 Credits

- Inspired by [Tradle](https://tradle.net/)
- Export data from [OEC World](https://oec.world/)
- Retro Mac UI inspired by classic System 6-9 aesthetics

---

**Enjoy playing TradeOut!** 🌍🎮
