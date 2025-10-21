const fs = require('fs');
const path = require('path');
const selfsigned = require('selfsigned');

const certDir = path.join(__dirname, 'certs');

// Create certs directory if it doesn't exist
if (!fs.existsSync(certDir)) {
  fs.mkdirSync(certDir);
}

console.log('Generating trusted local SSL certificate...');
console.log('This will create a local Certificate Authority (CA) and server certificate.\n');

try {
  // First, generate a Certificate Authority (CA)
  const caAttrs = [
    { name: 'commonName', value: 'Future Friends Local CA' },
    { name: 'countryName', value: 'US' },
    { shortName: 'ST', value: 'State' },
    { name: 'localityName', value: 'City' },
    { name: 'organizationName', value: 'Future Friends Dev' },
    { shortName: 'OU', value: 'Development' }
  ];

  const caPems = selfsigned.generate(caAttrs, {
    keySize: 2048,
    days: 825, // Max validity for trusted certs
    algorithm: 'sha256',
    extensions: [
      {
        name: 'basicConstraints',
        cA: true,
        critical: true
      },
      {
        name: 'keyUsage',
        keyCertSign: true,
        cRLSign: true,
        critical: true
      }
    ]
  });

  // Now generate the server certificate signed by our CA
  const serverAttrs = [
    { name: 'commonName', value: 'localhost' },
    { name: 'countryName', value: 'US' },
    { shortName: 'ST', value: 'State' },
    { name: 'localityName', value: 'City' },
    { name: 'organizationName', value: 'Future Friends' },
    { shortName: 'OU', value: 'Development' }
  ];

  const serverPems = selfsigned.generate(serverAttrs, {
    keySize: 2048,
    days: 365,
    algorithm: 'sha256',
    extensions: [
      {
        name: 'basicConstraints',
        cA: false
      },
      {
        name: 'keyUsage',
        digitalSignature: true,
        keyEncipherment: true
      },
      {
        name: 'extKeyUsage',
        serverAuth: true,
        clientAuth: true
      },
      {
        name: 'subjectAltName',
        altNames: [
          {
            type: 2, // DNS
            value: 'localhost'
          },
          {
            type: 2, // DNS
            value: '*.localhost'
          },
          {
            type: 7, // IP
            ip: '127.0.0.1'
          },
          {
            type: 7, // IP
            ip: '::1'
          }
        ]
      }
    ],
    issuer: caAttrs,
    signingKey: caPems.private
  });

  const certPath = path.join(certDir, 'cert.pem');
  const keyPath = path.join(certDir, 'key.pem');
  const caPath = path.join(certDir, 'ca.pem');

  // Write the files
  fs.writeFileSync(certPath, serverPems.cert);
  fs.writeFileSync(keyPath, serverPems.private);
  fs.writeFileSync(caPath, caPems.cert);

  console.log('✓ SSL certificates generated successfully!\n');
  console.log(`CA Certificate: ${caPath}`);
  console.log(`Server Certificate: ${certPath}`);
  console.log(`Private Key: ${keyPath}`);
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('📋 TO REMOVE BROWSER WARNINGS, ADD THE CA TO TRUSTED ROOTS:');
  console.log('═══════════════════════════════════════════════════════════\n');
  console.log('Windows:');
  console.log('1. Double-click on: certs\\ca.pem');
  console.log('2. Click "Install Certificate..."');
  console.log('3. Select "Current User" → Next');
  console.log('4. Select "Place all certificates in the following store"');
  console.log('5. Click "Browse" → Select "Trusted Root Certification Authorities"');
  console.log('6. Click "Next" → "Finish" → "Yes" to the security warning\n');
  console.log('OR run as Administrator:');
  console.log(`   certutil -addstore -user Root "${caPath}"\n`);
  console.log('Mac:');
  console.log('   sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain certs/ca.pem\n');
  console.log('Linux:');
  console.log('   sudo cp certs/ca.pem /usr/local/share/ca-certificates/futurefriends-ca.crt');
  console.log('   sudo update-ca-certificates\n');
  console.log('After adding the CA, restart your browser!');
  console.log('═══════════════════════════════════════════════════════════\n');
} catch (error) {
  console.error('Error generating certificates:', error.message);
  process.exit(1);
}
