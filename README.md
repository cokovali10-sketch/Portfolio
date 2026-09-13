# Satuarb Portfolio

**https://satuarb.dev**

Standalone glassmorphism portfolio website with Three.js 3D, multi-language support, and smooth animations.

## Features

- **Three.js 3D** — Rotating wireframe icosahedron with 500 particles + mouse parallax
- **Glassmorphism** — Blur, gradient borders, glow effects throughout
- **Multi-Language** — English, Russian, Kazakh (i18n system)
- **34 Projects** — Filterable by category with hover effects
- **Smooth Animations** — Scroll-triggered, typing effect, counters
- **Loading Screen** — Animated glass logo
- **Mobile Responsive** — 320px to 1440px, 7 breakpoints
- **Dark/Light Toggle** — Theme switching with persistence
- **Contact Form** — Glass inputs with validation

## Quick Start

```bash
# Python
python -m http.server 8000

# Node
npx serve .

# Open http://localhost:8000
```

## Deploy

### Netlify
Drag & drop this folder to [app.netlify.com/drop](https://app.netlify.com/drop)

### Vercel
```bash
vercel deploy
```

### Cloudflare Pages
1. Connect your GitHub repo
2. Build command: (leave empty)
3. Output directory: /

### Any Web Server
Upload all files to your web server.

## File Structure

```
Portfolio/
├── index.html          # Main HTML (2,449 lines)
├── README.md
├── assets/
│   ├── css/
│   │   └── style.css   # Glassmorphism CSS (3,174 lines)
│   ├── js/
│   │   └── app.js      # Three.js + i18n + interactions (883 lines)
│   ├── images/
│   └── 3d/
```

## Tech Stack

- HTML5
- CSS3 (Glassmorphism, 20+ animations)
- JavaScript (Vanilla, 883 lines)
- Three.js r128 (3D graphics)
- Google Fonts (Inter, JetBrains Mono)

## Languages

- English (EN)
- Russian (RU)
- Kazakh (KZ)

## Author

**Satuarb** — 15-year-old systems programmer from Kazakhstan
- GitHub: [@cokovali10-sketch](https://github.com/cokovali10-sketch)
- Building security tools and AI agents

## License

MIT
