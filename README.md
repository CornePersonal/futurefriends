# 🚀 Future Friends - Coming Soon Page

## 🌍 Overview

This project provides:

* ✅ Node.js 22 compatibility
* ✅ HTTPS/TLS support for local development
* ✅ Automatic Azure App Service support (no manual TLS setup needed)
* ✅ Security headers (XSS, frame protection, MIME sniffing prevention)
* ✅ Simple toggle between **dev** and **production** modes
* ✅ Zero-dependency setup for quick deployment

---

⚠️ Important Developer Notice

DO NOT TOUCH server.js under any circumstances.

This file contains critical logic for both local development and Azure App Service deployment.

Changing it can break the automatic environment detection, HTTPS handling, and Azure deployment.

All development and customization should happen in:

index.html → content and UI

styles/ or <style> sections → styling

generate-cert.js → local certificate setup (if needed)

## ⚙️ Project Modes

The app supports two modes:

| Mode                    | Description                                                | How to Run                                  |
| ----------------------- | ---------------------------------------------------------- | ------------------------------------------- |
| **Development (Local)** | Uses HTTPS with self-signed certificates for local testing | `npm run dev`                               |
| **Production (Azure)**  | Runs on HTTP (Azure handles HTTPS automatically)           | Automatically detected in Azure App Service |

Mode is determined by the `NODE_ENV` environment variable:

```bash
NODE_ENV=production   # Azure
NODE_ENV=development  # Local
```

---

## 🧑‍💻 Quick Start (Developers)

### 1. Prerequisites

* Node.js **v22+**
* npm (comes with Node)

### 2. Clone & Install

```bash
git clone <your_repo_url>
cd future-friends
npm install
```

### 3. Generate Local Certificates

Run once to create your local TLS certs:

```bash
node generate-cert.js
```

This will create a `certs/` folder with:

* `ca.pem` – Certificate Authority
* `cert.pem` – Server certificate
* `key.pem` – Private key

---

## 🔒 Trust the Local Certificate (Optional but Recommended)

After generating certs, you can **trust the CA certificate** to remove browser warnings.

### Windows (PowerShell)

```powershell
.\install-cert.ps1
```

Or manually:

1. Double-click `certs\ca.pem`
2. Click “Install Certificate…”
3. Choose “Current User” → “Trusted Root Certification Authorities”
4. Finish → Approve security prompt

### macOS

```bash
sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain certs/ca.pem
```

### Linux

```bash
sudo cp certs/ca.pem /usr/local/share/ca-certificates/futurefriends-ca.crt
sudo update-ca-certificates
```

Restart your browser afterward.

---

## 🧩 Run the Server

### ▶️ Local Development

```bash
npm run dev
```

Then open:

```
https://localhost:3000
```

### ☁️ Azure (Production)

Deployed automatically via GitHub → Azure App Service.

Azure sets `NODE_ENV=production` by default, so:

* HTTPS is handled by Azure
* `PORT` is automatically assigned
* No certificates are required

---

## 🔧 Environment Variables

| Variable   | Description                              | Default                       |
| ---------- | ---------------------------------------- | ----------------------------- |
| `NODE_ENV` | Set mode (`development` or `production`) | `development`                 |
| `PORT`     | Port to run server on                    | `3000` (local) / Auto (Azure) |

---

## 🗂️ File Structure

```
future-friends/
├── server.js             # Handles dev/prod logic
├── index.html            # Coming Soon page
├── generate-cert.js      # Certificate generation script
├── install-cert.ps1      # Windows helper for CA installation
├── certs/                # Local certs (auto-generated)
│   ├── ca.pem
│   ├── cert.pem
│   └── key.pem
└── README.md
```

---

## 🧹 Removing the Local CA Certificate

If you ever want to remove the trusted certificate:

### Windows

```powershell
certutil -delstore -user Root "Future Friends Local CA"
```

### macOS

```bash
sudo security delete-certificate -c "Future Friends Local CA" /Library/Keychains/System.keychain
```

---

## 🤝 Collaboration

* This repository can safely be shared with other developers.
* Local dev mode keeps everything self-contained.
* Azure App Service automatically deploys on every **push to the main branch** (if GitHub Actions or Deployment Center is configured).

---

## 📄 License

MIT
