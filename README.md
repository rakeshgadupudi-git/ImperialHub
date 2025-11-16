# Imperial Hub - Shopping Website

A modern, beautiful shopping website built with React, Vite, and MongoDB.

## Features

- 🎨 **Stunning Hero Section** with animated WebGL background using OGL
- 🌓 **Theme Toggle** - Switch between dark and light modes
- 💎 **Glassy Header** - Modern glassmorphism design
- 🎴 **Bento Grid Layout** - Beautiful featured products display
- 🛍️ **Shopping Cart** - Ready for e-commerce functionality
- 🚀 **Fast & Modern** - Built with Vite for optimal performance

## Tech Stack

### Frontend
- React 19
- Vite
- OGL (WebGL library)
- CSS3 with modern features

### Backend
- Node.js
- Express
- MongoDB with Mongoose

## Getting Started

### Prerequisites
- Node.js (v20+)
- MongoDB (local or Atlas)

### Installation

1. **Install frontend dependencies:**
```bash
npm install
```

2. **Install backend dependencies:**
```bash
cd server
npm install
```

3. **Set up environment variables:**
```bash
cd server
cp .env.example .env
# Edit .env with your MongoDB connection string
```

4. **Start MongoDB** (if running locally)

5. **Start the backend server:**
```bash
cd server
npm run dev
```

6. **Seed the database** (optional):
Visit `http://localhost:5000/api/seed` in your browser or use curl:
```bash
curl -X POST http://localhost:5000/api/seed
```

7. **Start the frontend dev server:**
```bash
npm run dev
```

8. **Open your browser:**
Navigate to `http://localhost:5173`

## Project Structure

```
imperial-hub/
├── src/
│   ├── components/
│   │   ├── DarkVeil.jsx      # WebGL animated background
│   │   ├── Header.jsx         # Glassy header with theme toggle
│   │   ├── Hero.jsx           # Hero section
│   │   └── BentoCards.jsx     # Featured products grid
│   ├── App.jsx
│   └── main.jsx
├── server/
│   ├── index.js               # Express server
│   └── package.json
└── package.json
```

## API Endpoints

- `GET /api/products/featured` - Get featured products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `POST /api/seed` - Seed database with sample data
- `GET /api/health` - Health check

## Features in Detail

### DarkVeil Component
Animated WebGL shader background that creates a mesmerizing visual effect in the hero section.

### Theme Toggle
Persistent theme preference stored in localStorage, with smooth transitions between dark and light modes.

### Bento Cards
Responsive grid layout showcasing featured products with hover effects and smooth animations.

## Development

The project uses:
- **Vite** for fast development and building
- **ESLint** for code quality
- **Modern ES6+** JavaScript

## License

MIT
