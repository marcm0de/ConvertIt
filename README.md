# ConvertIt

> One tool for all conversions. Fast, private, client-side.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### 📏 Unit Converter
7 categories with 50+ unit types: Length, Weight, Temperature, Speed, Area, Volume, Data Storage.

### 🎨 Color Converter
Convert between HEX, RGB, HSL, and CMYK with a live visual preview and color picker.

### 🔢 Number Base Converter
Binary ↔ Decimal ↔ Hexadecimal ↔ Octal with a bit-level display.

### 🌍 Timezone Converter
Convert times between 14 major timezones with a live world clock.

### 💱 Currency Converter
10 major currencies with mock exchange rates (USD, EUR, GBP, JPY, CAD, AUD, CHF, CNY, INR, BRL).

### 🔐 Data Encoding
Base64, URL encoding, and HTML entity encode/decode.

### #️⃣ Hash Generator
MD5, SHA-1, SHA-256, and SHA-512 using the Web Crypto API — your data never leaves the browser.

### 📋 History & Favorites
- Last 20 conversions saved automatically
- Pin frequently used conversions as favorites

### 🌙 Dark/Light Mode
Toggle between themes with persistent preference.

### ⌨️ Keyboard Shortcuts
Press `Tab` to swap source and target values.

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/yourusername/ConvertIt.git
cd ConvertIt

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) to use the app.

## 🛠 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **State:** Zustand (with persistence)
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Crypto:** Web Crypto API (SHA hashes), JS implementation (MD5)

## 🔒 Privacy

All conversions happen entirely in your browser. No data is sent to any server. Zero tracking.

## 📄 License

[MIT](LICENSE) — use it however you want.
