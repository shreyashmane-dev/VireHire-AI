# VeriHire AI: Neural Recruitment Intelligence Hub

**VeriHire AI** is a cutting-edge, enterprise-grade cybersecurity platform designed to protect job seekers and recruiters from the global surge in recruitment fraud. Built with a cinematic "Neural Terminal" aesthetic, it leverages advanced AI to provide real-time threat detection and community-driven intelligence.

![VeriHire AI Overview](https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200)

## 🛡️ Core Capabilities

- **Neural Threat Feed**: Real-time aggregation of job scams worldwide via NewsAPI, analyzed and ranked by the Groq Llama-3.3 engine.
- **AI Intelligence Agent**: A cyberpunk-themed chat interface for deep forensic analysis of suspicious job offers, emails, and recruiter profiles.
- **Community Scam Watch**: A collective intelligence hub where users report and verify fraud clusters to protect the network.
- **Risk Assessment Gauge**: Instant 0-100 risk scoring based on linguistic patterns, domain verification, and behavioral analysis.
- **Cinematic UX**: A premium, high-fidelity interface featuring glassmorphism, fluid animations (Framer Motion), and a futuristic command-center layout.

## 🚀 Tech Stack

- **Framework**: [Next.js 14+](https://nextjs.org/) (App Router)
- **Styling**: Vanilla CSS / Tailwind (for core layout) with custom Glassmorphism tokens.
- **AI Engine**: [Groq](https://groq.com/) (Llama-3.3-70B-Versatile)
- **Backend/Auth**: [Firebase](https://firebase.google.com/) (Firestore & Authentication)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+
- Firebase Project
- Groq API Key
- NewsAPI Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/shreyashmane-dev/VireHire-AI.git
   cd VireHire-AI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

   FIREBASE_PROJECT_ID=your_id
   FIREBASE_CLIENT_EMAIL=your_email
   FIREBASE_PRIVATE_KEY="your_private_key"

   GROQ_API_KEY=your_groq_key
   NEWS_API_KEY=your_news_api_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

## 🌐 Community & Security

VeriHire AI thrives on collective defense. Our **Community Scam Watch** allows users to publish verified intelligence, which is then mapped to global threat clusters. All data is handled with enterprise-grade encryption and users have full control over their data (including a complete "Danger Zone" purge option).

---

Developed with ❤️ by the VeriHire Core Team. Protect your career.
