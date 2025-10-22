// ============================================
// Do not ever touch this file!
// Talk to Corné if changes are needed here (I will most likely say no).
// ============================================

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

const isAzure = !!process.env.WEBSITE_INSTANCE_ID; // auto-detect if running in Azure
const PORT = process.env.PORT || 3000;

// MongoDB connection string - should be set in Azure App Service Configuration
const MONGODB_URI = process.env.MONGODB_URI || process.env.COSMOS_CONNECTION_STRING;

const htmlContent = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

// MongoDB connection test function
async function testMongoConnection() {
  if (!MONGODB_URI) {
    return {
      connected: false,
      error: 'MongoDB connection string not configured',
      message: 'Please set MONGODB_URI or COSMOS_CONNECTION_STRING in environment variables'
    };
  }

  let client;
  try {
    client = new MongoClient(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });
    
    await client.connect();
    await client.db('admin').command({ ping: 1 });
    
    const dbName = client.db().databaseName || 'default';
    
    return {
      connected: true,
      message: 'Successfully connected to MongoDB',
      database: dbName,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      connected: false,
      error: error.message,
      message: 'Failed to connect to MongoDB'
    };
  } finally {
    if (client) {
      await client.close();
    }
  }
}

const requestHandler = (req, res) => {
  // Health check endpoint for database connection
  if (req.url === '/api/db-status') {
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'X-Content-Type-Options': 'nosniff',
      'Access-Control-Allow-Origin': '*'
    });
    
    testMongoConnection()
      .then(status => {
        res.end(JSON.stringify(status, null, 2));
      })
      .catch(err => {
        res.end(JSON.stringify({
          connected: false,
          error: err.message,
          message: 'Unexpected error testing connection'
        }, null, 2));
      });
    return;
  }

  // Default HTML response
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
