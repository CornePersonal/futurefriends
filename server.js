const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

// HTTPS/TLS configuration removed for Azure App Service
// Azure App Service handles TLS termination at the platform level

// Read the HTML file
const htmlContent = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

// Create HTTP server
const server = http.createServer((req, res) => {
  // Handle all routes with the coming soon page
  res.writeHead(200, {
    'Content-Type': 'text/html',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block'
  });
  res.end(htmlContent);
});

server.listen(PORT, () => {
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║                                                           ║');
  console.log('║   🚀 Future Friends - Coming Soon Page                   ║');
  console.log('║                                                           ║');
  console.log('║   ✓ Server running on HTTP                               ║');
  console.log(`║   ✓ Port: ${PORT}                                           ║`);
  console.log('║   ✓ Azure App Service compatible                         ║');
  console.log('║                                                           ║');
  console.log('║   Note: Azure App Service handles HTTPS at the           ║');
  console.log('║   platform level - no certificate needed in code.        ║');
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