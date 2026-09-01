# Signo 🤟

> **Master Greek Sign Language (ΕΝΓ) Letter by Letter with Real-Time AI Feedback.**

[![Build Status](https://img.shields.io/badge/build-passing-06D6A0.svg?style=for-the-badge&logo=github-actions)](https://github.com/seograth/signo)
[![Accessibility WCAG AAA](https://img.shields.io/badge/accessibility-WCAG%20AAA-00B4D8.svg?style=for-the-badge&logo=w3c)](https://www.w3.org/TR/WCAG21/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge)](LICENSE)

---

## 📋 Overview

**Signo** is an open-source, interactive sign language learning platform—often described as "Duolingo for Sign Language". Specifically engineered for **Greek Sign Language (Ελληνική Νοηματική Γλώσσα - ΕΝΓ)**, Signo transforms static fingerspelling charts into immersive, real-time feedback loops.

By pairing **MediaPipe 3D Hand Tracking** and **TensorFlow.js** neural classification with a **Three.js procedural 3D hand guide**, Signo evaluates user hand gestures directly in the browser—with **zero server latency** and **100% video privacy**.

---

## ✨ Key Features

- 🎯 **Real-Time AI Hand Tracking**: Extracts 21 3D geometric landmarks from your webcam feed using MediaPipe and evaluates hand orientation and finger bends via client-side TensorFlow.js neural network inference.
- 🖐️ **Interactive 3D Hand Demonstrator**: Features a continuous watertight Three.js procedural avatar rendering all 24 Greek fingerspelling letters. Supports full 360° click-and-drag view rotation and left/right hand toggling.
- 🎮 **Visual-First Gamification**:
  - **Word Quest**: Spell level-based Greek words letter-by-letter with instant feedback and celebratory confetti.
  - **Alphabet Explorer**: Free-form practice across all 24 Greek letters (Α–Ω) with automated 5-second showcase cycles.
  - **Speed Rush**: Test your signing fluency under a 60-second timer with high-score tracking and streak multipliers.
- ♿ **Deaf & Hard of Hearing (HOH) Accessibility**: Built from the ground up with non-auditory visual feedback, color-blind friendly states, high-contrast skeleton overlays, and WCAG AAA compliance.
- 🔒 **100% Client-Side Video Privacy**: No camera frames or video data leave your device. All computer vision inference runs locally inside the browser.

---

## 🎨 Design System & Accessibility Architecture

Computer vision pose estimation requires robust visual isolation between the user's hand landmarks and background environments. Signo enforces a specialized design system optimized for skin-tone separation, lighting variance, and non-auditory feedback.

### Contrast & Video Isolation
Camera feeds and 3D avatar viewports persistently enforce **Deep Slate Navy (`#1A1D28`)** backgrounds with darkened webcam contrast filters (`brightness(0.50)` / `contrast(1.20)`). This ensures high contrast for hand landmark vectors regardless of ambient lighting or user skin tone.

### Non-Auditory Feedback Engine
Rather than relying solely on sound cues, gesture verification is conveyed through visual micro-interactions:
- **Correct Sign Match**: Triggers a **Success Mint (`#06D6A0`)** border glow, checkmark badge, and charging progress fill bar.
- **Incorrect / Missed Sign**: Displays **Vibrant Coral (`#FF6B6B`)** warnings and corrective orientation badges.
- **Skeleton Vectors**: Joint connections are drawn in **Electric Cyan (`#00B4D8`)** with **Warm Amber (`#FFB703`)** knuckle nodes and outer glow shadows.

### Core Token Palette

| Design Token | Hex Code | Functional Role |
| :--- | :--- | :--- |
| `--color-brand-primary` | `#00B4D8` *(Electric Cyan)* | Primary CTAs, active tab indicators, skeleton vector traces |
| `--color-brand-secondary` | `#FF6B6B` *(Vibrant Coral)* | Warnings, missed sign alerts, secondary highlights |
| `--color-accent-amber` | `#FFB703` *(Warm Amber)* | Streaks, active letter focus, XP counters, joint nodes |
| `--color-accent-success` | `#06D6A0` *(Success Mint)* | Verified gesture matches, progress bars, victory states |
| `--color-canvas-dark` | `#1A1D28` *(Deep Slate Navy)* | Camera viewports, 3D avatar backgrounds, root dark canvas |
| `--color-canvas-light` | `#F4F6F9` *(Soft Cloud)* | Light container elements, high-contrast backgrounds |
| `--color-text-primary-dark`| `#FFFFFF` *(Pure Chalk)* | High-contrast typography over dark canvas elements |

---

## 🛠️ Tech Stack & Architecture

```mermaid
graph TD
    A[User Webcam Feed] --> B[@mediapipe/hands Engine]
    B -->|21 3D Landmarks| C[TensorFlow.js GSL Classifier]
    C -->|Target Gesture Match| D[React 18 State Engine]
    D --> E[Three.js 3D Hand Avatar]
    D --> F[Visual Micro-Interactions & Confetti]
```

### Technical Breakdown

- **Frontend Core**: React 18, TypeScript, Vite, React Router v6
- **UI & Animation**: Material-UI (MUI v6), Framer Motion, Lucide Icons, Canvas Confetti
- **Computer Vision & ML**: `@mediapipe/hands`, `@mediapipe/camera_utils`, `@tensorflow/tfjs`
- **3D Graphics**: Three.js (`three`), WebGL Shader/Lighting Pipelines
- **Internationalization**: `i18next`, `react-i18next`
- **Code Quality**: ESLint, Prettier, Stylelint, Husky, lint-staged

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your environment:
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher (or `pnpm` / `yarn`)
- **Webcam**: Standard USB or built-in web camera with browser permissions enabled

### Local Development Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/seograth/signo.git
   cd signo
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start Development Server**:
   ```bash
   npm run start
   ```
   Open your browser and navigate to `http://localhost:5173`.

4. **Build for Production**:
   ```bash
   npm run build
   ```

5. **Preview Production Bundle**:
   ```bash
   npm run preview
   ```

---

## 🧪 Testing, Quality & Linting

Signo maintains strict code hygiene and formatting standards:

```bash
# Run TypeScript compilation check
npx tsc --noEmit

# Run ESLint across all TypeScript & React source files
npm run lint

# Format code with Prettier
npm run format

# Run Stylelint on CSS files
npx stylelint "src/**/*.css"
```


