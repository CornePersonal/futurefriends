const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

// Load SSL certificate and key
const options = {
  key: fs.readFileSync(path.join(__dirname, 'certs', 'key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'certs', 'cert.pem'))
};

// Read the HTML file
const htmlContent = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

// Create HTTPS server
const server = https.createServer(options, (req, res) => {
  // Handle all routes with the coming soon page
  res.writeHead(200, {
    'Content-Type': 'text/html',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
  });
  res.end(htmlContent);
});

server.listen(PORT, () => {
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║                                                           ║');
  console.log('║   🚀 Future Friends - Coming Soon Page                   ║');
  console.log('║                                                           ║');
  console.log('║   ✓ Server running with TLS/HTTPS                        ║');
  console.log(`║   ✓ URL: https://localhost:${PORT}                           ║`);
  console.log('║   ✓ Node.js 22 TLS enabled                               ║');
  console.log('║                                                           ║');
  console.log('║   Note: You will see a browser security warning          ║');
  console.log('║   because this uses a self-signed certificate.           ║');
  console.log('║   Click "Advanced" and "Proceed to localhost" to view.   ║');
  console.log('║                                                           ║');
  console.log('╚═══════════════════════════════════════════════════════════╝');
});

// Handle server errors
server.on('error', (err) => {
  console.error('Server error:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\nShutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\nShutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
