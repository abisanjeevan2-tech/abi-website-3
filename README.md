# Abi's Drapes & Makeup 💄

> South Indian Bridal Makeup & Saree Draping — Charlotte, NC

A luxury beauty brand website with Firebase authentication and Firestore database.

---

## 🚀 Quick Start

### Option 1 — VS Code Live Server (Recommended)

1. Install [VS Code](https://code.visualstudio.com/)
2. Install the **Live Server** extension by Ritwick Dey
3. Open this folder in VS Code
4. Right-click `index.html` → **Open with Live Server**
5. Visit `http://localhost:5500`

### Option 2 — Python Server

```bash
cd abi-website
python3 -m http.server 5500
```
Then open `http://localhost:5500`

> ⚠️ Must use `http://localhost` — opening the HTML file directly won't work (Firebase requires HTTP)

---

## 📁 Project Structure

```
abi-website/
├── index.html          # Main website (all 7 pages)
├── imgs.js             # Photo data (base64 encoded)
├── app.js              # Page navigation & gallery logic
├── firebase-init.js    # Firebase auth & Firestore database
└── README.md
```

---

## ✨ Features

- 🏠 **Home** — Hero, services preview, gallery, testimonials
- 💄 **Services** — 6 services with pricing (Bridal, Saree, Party, Hair, Trial, Engagement)
- 🖼️ **Gallery** — Filterable masonry photo gallery
- 👤 **About** — Abi's story and expertise
- 📅 **Booking** — Appointment form saved to Firebase
- 📞 **Contact** — Contact form + FAQ
- 🔐 **Login** — Email/Password + Google Sign-In
- 📊 **Dashboard** — View your bookings after login

---

## 🔥 Firebase Setup

Already connected to:
- **Project:** `abis-drapes-makeup`
- **Auth:** Email/Password + Google Sign-In ✅
- **Database:** Firestore (`bookings` collection) ✅
- **Email:** `abira3019@gmail.com`

---

## 🌐 Deploy to GitHub Pages

1. Push this repo to GitHub
2. Go to **Settings → Pages**
3. Set source to `main` branch
4. Visit `https://yourusername.github.io/abi-website`

> Note: Firebase login won't work on GitHub Pages unless you add your GitHub Pages domain to Firebase → Authentication → Authorized Domains

---

## 📱 Pages

| Page | Description |
|------|-------------|
| Home | Landing page with hero image |
| Services | All 6 services with pricing |
| Gallery | Photo portfolio with filters |
| About | About Abi |
| Booking | Book an appointment |
| Contact | Get in touch + FAQ |
| Login | Sign in / Create account |
| Dashboard | View bookings (after login) |

---

Built with ❤️ for Abi's Drapes & Makeup, Charlotte NC
