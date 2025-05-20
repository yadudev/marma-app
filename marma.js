var https = require('https');
//var http = require('http');
const fs = require('fs');
const app = require('./app.js');

var privateKey = fs.readFileSync('/etc/ssl/private.key', 'utf8').toString();

var certificate = fs.readFileSync('/etc/ssl/certificate.crt', 'utf8').toString();

var ca = fs.readFileSync('/etc/ssl/ca_bundle.crt').toString();

var options = { key: privateKey, cert: certificate, ca: ca };

var server = https.createServer(options, app);

const PORT = process.env.PORT || 3000;

// Create HTTP server
//const server = http.createServer(app);

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
