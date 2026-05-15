# VeriHire AI: Neural Recruitment Intelligence Hub

**VeriHire AI** is a state-of-the-art, enterprise-grade cybersecurity platform engineered to shield job seekers, freelancers, and recruiters from the global epidemic of recruitment fraud. Built with a high-fidelity "Neural Terminal" aesthetic, it combines real-time threat detection, AI forensic analysis, and community-driven collective intelligence.

---

## 🛡️ Core Capabilities & Features

### 1. Neural Threat Intelligence Feed
Real-time monitoring of global fraud clusters. The platform aggregates live job scam reports from worldwide news sources, processes them through our **Groq Llama-3.3-70B engine**, and presents them as actionable intelligence.
- **Deterministic Mapping**: Ensures 100% link integrity and authentic news thumbnails.
- **Risk Scoring**: Instant classification (Critical, High, Medium) based on threat severity.

### 2. Forensic AI Chat (Neural Terminal)
A cinematic, terminal-style interface designed for deep analysis of suspicious communications.
- **Risk Assessment Gauge**: Visualizes threat levels from 0 to 100.
- **Pattern Recognition**: Analyzes linguistic markers, domain spoofing, and social engineering tactics.
- **Real-time Status Tickers**: Continuous monitoring of the intelligence stream during analysis.

### 3. Community Scam Watch
A collective defense hub where users contribute to a global database of verified threats.
- **Peer Verification**: High-fidelity reports from verified "VeriHire Agents."
- **Fraud Mapping**: Tracking of cross-platform scam campaigns (LinkedIn, WhatsApp, Telegram, etc.).

### 4. Advanced Security Suite
- **Danger Zone**: Full data sovereignty with a one-click account and data purge protocol.
- **Persistence Layer**: Seamless session management using Firebase Local Persistence.
- **Premium UX**: Framer Motion animations, glassmorphism, and responsive cinematic layouts.

---

## 🚀 Installation & Setup Guide

### 📋 Prerequisites
- **Node.js**: Version 18.x or higher
- **Firebase**: A project with Firestore and Authentication (Google OAuth) enabled.
- **Groq API**: An active API key for neural analysis.
- **NewsAPI**: An active API key for the global threat feed.

### 🛠️ Step-by-Step Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/shreyashmane-dev/VireHire-AI.git
   cd VireHire-AI
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env.local` file in the root directory and populate it with your credentials:
   ```env
   # Firebase Client SDK
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=verihire-ai.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=verihire-ai
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=verihire-ai.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

   # Firebase Admin (Required for API Routes)
   FIREBASE_PROJECT_ID=verihire-ai
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk@...
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"

   # AI Engines & Intelligence
   GROQ_API_KEY=gsk_...
   GROQ_NEWS_API_KEY=gsk_... # Optional: Dedicated quota for threat feed
   NEWS_API_KEY=c88000e1...
   ```

4. **Initialize Firebase**
   - Ensure Firestore is in **Native Mode**.
   - Create a collection named `reports` for community data.
   - Create a collection named `daily_intelligence` for news caching.

5. **Run Development Server**
   ```bash
   npm run dev
   ```
   Navigate to `http://localhost:3000` to access the neural terminal.

---

## 🎨 Visual Intelligence (UI/UX)

| Neural Terminal | Threat Monitoring | Community Intelligence |
| :--- | :--- | :--- |
| ![Chat](https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=400) | ![Feed](https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=400) | ![Community](https://images.unsplash.com/photo-1522071823991-b9671f903f70?auto=format&fit=crop&q=80&w=400) |
| *High-fidelity AI forensic analysis interface.* | *Real-time global scam cluster visualization.* | *Collective defense and verified reports.* |

---

## 🔐 Security Standards
VeriHire AI follows the **NIST Cybersecurity Framework** guidelines for threat detection and response. All communications are encrypted, and user data is strictly isolated within your Firebase instance.

Developed with a mission to decentralize recruitment security. **Stay Safe. Stay Verified.**

---
© 2024 VeriHire AI Core Team.
