// src/app/layout.js
import './globals.css'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'ShieldHer - AI-Powered Safety Ecosystem',
  description: 'Protection that acts before danger happens',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: '#1a1a2e',
              color: '#fff',
              border: '1px solid rgba(139, 92, 246, 0.3)',
            },
          }}
        />
      </body>
    </html>
  )
}

// ============================================

// src/app/globals.css
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  @apply bg-dark text-white overflow-x-hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif;
}

.gradient-bg {
  @apply fixed top-0 left-0 right-0 bottom-0 -z-10;
  background: radial-gradient(ellipse at top, #1e1b4b 0%, #0a0a0f 50%);
}

.animated-gradient {
  @apply absolute w-[200%] h-[200%];
  background: linear-gradient(45deg, 
    rgba(139, 92, 246, 0.1) 0%, 
    rgba(59, 130, 246, 0.1) 25%, 
    rgba(16, 185, 129, 0.1) 50%, 
    rgba(139, 92, 246, 0.1) 100%);
  animation: gradientMove 15s ease infinite;
}

@keyframes gradientMove {
  0%, 100% { transform: translate(-25%, -25%); }
  50% { transform: translate(-50%, -50%); }
}

.glass-card {
  @apply bg-dark-card backdrop-blur-lg border border-white/10 rounded-2xl p-6 transition-all duration-300;
}

.glass-card:hover {
  @apply bg-white/[0.08] border-primary/30 -translate-y-1;
}

.btn-primary {
  @apply bg-gradient-primary px-6 py-3 rounded-xl font-semibold transition-all duration-300 border-0 cursor-pointer text-white;
}

.btn-primary:hover {
  @apply scale-105;
  box-shadow: 0 10px 30px rgba(139, 92, 246, 0.4);
}

.btn-danger {
  @apply bg-gradient-danger px-6 py-3 rounded-xl font-semibold transition-all duration-300 border-0 cursor-pointer text-white;
}

.btn-danger:hover {
  @apply scale-105;
  box-shadow: 0 10px 30px rgba(239, 68, 68, 0.4);
}

.radar-scan {
  @apply absolute w-[600px] h-[600px] border-2 border-primary/20 rounded-full;
  animation: radarPulse 3s ease-out infinite;
}

@keyframes radarPulse {
  0% { transform: scale(0.5); opacity: 1; }
  100% { transform: scale(1.5); opacity: 0; }
}

.pulse-glow {
  animation: pulseGlow 2s ease-in-out infinite;
}

@keyframes pulseGlow {
  0%, 100% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.5); }
  50% { box-shadow: 0 0 40px rgba(139, 92, 246, 0.8); }
}

.danger-pulse {
  animation: dangerPulse 1s ease-in-out infinite;
}

@keyframes dangerPulse {
  0%, 100% { 
    box-shadow: 0 0 30px rgba(239, 68, 68, 0.6);
    border-color: rgba(239, 68, 68, 0.6);
  }
  50% { 
    box-shadow: 0 0 60px rgba(239, 68, 68, 1);
    border-color: rgba(239, 68, 68, 1);
  }
}

.mapboxgl-canvas {
  border-radius: 12px;
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #0a0a0f;
}

::-webkit-scrollbar-thumb {
  background: rgba(139, 92, 246, 0.5);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(139, 92, 246, 0.8);
}