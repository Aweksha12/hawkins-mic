# Hawkins Radio: Cerebro Sync

A real-time, high-fidelity video synchronization platform inspired by the aesthetic of Hawkins National Laboratory. This project enables a "Broadcaster" to stream and control video playback for multiple "Listeners" with sub-second latency and synchronized playback states.

## 🛠 Tech Stack

### Frontend
- **React.js**: Core UI library for component-based architecture.
- **Vite**: Ultra-fast build tool and development server.
- **Tailwind CSS**: Utility-first CSS framework for modern, responsive styling.
- **Socket.io-client**: Real-time bidirectional communication for synchronization events.
- **HTML5 Video API**: Low-level control over playback, seek, and rate states.

### Backend
- **Node.js & Express**: Scalable server-side environment and RESTful API routing.
- **Socket.io**: WebSocket implementation for managing rooms and broadcasting pulses.
- **Express-fileupload**: Middleware for handling multi-part video uploads to the local file system.

## 🚀 MVP (Minimum Viable Product) Features

- **Broadcaster Control**: Centralized authority for play, pause, seek, and playback rate adjustments.
- **Real-time Synchronization**: Automated "Sync Pulses" every 5 seconds and instant event broadcasting to keep all participants aligned.
- **Session Management**: Room-based architecture where listeners tune into a specific "Frequency" (Room ID).
- **Dual-Source Support**: Ability to broadcast via direct network URLs or by uploading local video files to the Cerebro server.
- **Manual Calibration**: A "Click to Sync" mechanism for listeners to bypass browser autoplay restrictions and re-align with the master feed.

## 💎 Uniqueness

- **Thematic UX/UI**: Immersive "Upside Down" aesthetic featuring CRT scanlines, flicker effects, oscilloscope signal monitors, and interactive control dials.
- **Drift Compensation**: Intelligent synchronization logic that only forces a "jump" if the time difference exceeds 300ms, preventing micro-stuttering.
- **Network Awareness**: The backend automatically detects the local LAN IP to ensure seamless connectivity for listeners on the same network.
- **Dynamic Transmission Rates**: Native support for synchronized playback speeds (0.5x, 1x, 1.5x, 2x), allowing for collaborative analysis or fast-forwarding.
- **Operative Identity**: Persistent callsign-based identification for tracking active listeners within the broadcaster's tactical dashboard.

## 🚀 Deployment Guide

This project is a monorepo consisting of a Frontend (`cerebro1-app`) and a Backend (`cerebro1-backend`).

### 🌐 Frontend (Vercel)
The frontend is optimized for **Vercel**.
1. Import the repository into Vercel.
2. Set the **Root Directory** to `cerebro1-app`.
3. Add an Environment Variable: `VITE_BACKEND_URL` with your deployed backend's URL.

### 📡 Backend (Render / Railway)
The backend requires a persistent server for **WebSockets (Socket.io)** and therefore is **not suitable for Vercel Serverless Functions**.
1. Deploy the `cerebro1-backend` folder to a platform like **Render**, **Railway**, or **Fly.io**.
2. Ensure the platform supports long-running Node.js processes.
3. If using Render, use a "Web Service" with the build command `npm install` and start command `node index.js`.

