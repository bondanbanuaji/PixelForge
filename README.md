# PixelForge

> AI-Powered Image Resolution Transformation Platform

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38bdf8?style=flat-square&logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

PixelForge is an enterprise-grade image processing platform that combines AI-powered upscaling with classical downscaling algorithms. All processing happens locally - no external APIs, zero cost, unlimited usage.

## ✨ Features

- **🔼 AI Upscaling** - Enhance image resolution up to 8x (2x, 4x, 8x)
- **🔽 Fast Downscaling** - Multiple algorithms: Lanczos3, Mitchell, Cubic
- **🔒 Privacy First** - 100% local processing, no data leaves your machine
- **🎨 Modern UI** - Dark theme with glassmorphism effects
- **⚡ Fast** - Powered by Sharp for lightning-fast processing
- **📱 Responsive** - Works on desktop, tablet, and mobile

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Global styles
│   ├── api/
│   │   └── process/route.ts  # Image processing API
│   └── dashboard/
│       ├── page.tsx          # Main dashboard
│       ├── history/page.tsx  # Processing history
│       └── settings/page.tsx # User settings
├── components/
│   ├── UploadZone.tsx        # Drag-drop upload
│   ├── ConfigPanel.tsx       # Processing options
│   └── ProcessingStatus.tsx  # Progress indicator
├── stores/
│   └── processing.ts         # Zustand state
└── lib/
    └── utils.ts              # Utility functions
```

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS + DaisyUI
- **State:** Zustand
- **Processing:** Sharp
- **Icons:** Heroicons

## 📸 Screenshots

### Landing Page
- Hero section with animated gradient background
- Feature cards highlighting capabilities
- How it works timeline

### Dashboard
- Drag-drop upload zone
- Operation type selection (Upscale/Downscale)
- Scale factor options (2x, 4x, 8x)
- Quality mode selection
- Real-time processing status

## 📝 License

MIT © 2024 PixelForge
