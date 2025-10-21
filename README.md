# Future Friends - Coming Soon Page

A secure landing page with Node.js 22 and TLS/HTTPS support showing a "Coming Soon" message.

## Features

- ✅ Node.js 22 with HTTPS/TLS support
- ✅ Local Certificate Authority (CA) for trusted certificates
- ✅ No browser security warnings (after CA installation)
- ✅ Beautiful gradient landing page
- ✅ Responsive design
- ✅ Security headers included

## Quick Setup

1. Make sure you have Node.js 22 or higher installed:
   ```bash
   node --version
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Generate SSL certificates:
   ```bash
   node generate-cert.js
   ```

4. **Install the CA certificate** (removes browser warnings):
   
   **Windows (PowerShell):**
   ```powershell
   .\install-cert.ps1
   ```
   
   **Or manually on Windows:**
   - Double-click `certs\ca.pem`
   - Click "Install Certificate..."
   - Select "Current User" → Next
   - Select "Place all certificates in the following store"
   - Browse → "Trusted Root Certification Authorities" → OK
   - Next → Finish → Yes to security warning
   
   **Mac:**
   ```bash
   sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain certs/ca.pem
   ```
   
   **Linux:**
   ```bash
   sudo cp certs/ca.pem /usr/local/share/ca-certificates/futurefriends-ca.crt
   sudo update-ca-certificates
   ```

5. **Restart your browser** (important!)

6. Start the server:
   ```bash
   npm start
   ```

7. Open your browser and navigate to:
   ```
   https://localhost:3000
   ```

## No More Security Warnings! 🎉

After installing the CA certificate and restarting your browser, you should see a secure padlock icon without any warnings.

## Files

- `server.js` - HTTPS server with TLS support
- `index.html` - Coming Soon landing page
- `generate-cert.js` - Script to generate CA and server certificates
- `install-cert.ps1` - PowerShell script to install CA certificate (Windows)
- `certs/` - Directory containing:
  - `ca.pem` - Certificate Authority (install this to trust the server cert)
  - `cert.pem` - Server certificate
  - `key.pem` - Private key

## Customization

- Change the port by setting the `PORT` environment variable
- Modify `index.html` to customize the landing page content
- Update styles in the `<style>` section of `index.html`

## Removing the Certificate

If you need to remove the installed CA certificate later:

**Windows:**
```powershell
certutil -delstore -user Root "Future Friends Local CA"
```

**Mac:**
```bash
sudo security delete-certificate -c "Future Friends Local CA" /Library/Keychains/System.keychain
```

## License

MIT