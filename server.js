// ============================================
// Do not ever touch this file!
// Talk to Corné if changes are needed here (I will most likely say no).
// ============================================

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const isAzure = !!process.env.WEBSITE_INSTANCE_ID; // auto-detect if running in Azure
const PORT = process.env.PORT || 3000;

const htmlContent = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

const requestHandler = (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/html',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block'
  });
  res.end(htmlContent);
};

if (isAzure) {
  const server = http.createServer(requestHandler);

  server.listen(PORT, '0.0.0.0', () => {
    console.log('╔═══════════════════════════════════════════════════════════╗');
    console.log('║                                                           ║');
    console.log('║   🚀 Future Friends - Coming Soon Page                   ║');
    console.log('║                                                           ║');
    console.log('║   ✓ Running in Azure App Service                         ║');
    console.log(`║   ✓ HTTP on port: ${PORT}                                   ║`);
    console.log('║   ✓ TLS handled by Azure platform                        ║');
    console.log('║                                                           ║');
    console.log('╚═══════════════════════════════════════════════════════════╝');
  });
} else {
  let server;
  const certDir = path.join(__dirname, 'certs');
  const keyPath = path.join(certDir, 'key.pem');
  const certPath = path.join(certDir, 'cert.pem');

  if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
    const options = {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath)
    };
    server = https.createServer(options, requestHandler);

    server.listen(8080, () => {
      console.log('╔═══════════════════════════════════════════════════════════╗');
      console.log('║                                                           ║');
      console.log('║   🚀 Future Friends - Local Dev Server                   ║');
      console.log('║                                                           ║');
      console.log('║   ✓ HTTPS (self-signed)                                  ║');
      console.log('║   ✓ URL: https://localhost:8080                          ║');
      console.log('║                                                           ║');
      console.log('╚═══════════════════════════════════════════════════════════╝');
    });
  } else {
    // fallback to HTTP if no certs
    server = http.createServer(requestHandler);
    server.listen(8080, () => {
      console.log('⚠️  No certs found — running on plain HTTP instead.');
      console.log('👉  Visit: http://localhost:8080');
    });
  }
}

process.on('SIGTERM', () => process.exit(0));
process.on('SIGINT', () => process.exit(0));
