const express  = require('express');
const app      = express();
const httpProxy = require('http-proxy');
const apiProxy = httpProxy.createProxyServer();
const serverOne = 'http://localhost:3001',
    ServerTwo = 'http://localhost:3002';
 
app.all(/\/map(\/)?/, function(req, res) {
    console.log('redirecting to Server1');
    apiProxy.web(req, res, {target: serverOne});
});

app.all(/\/test(\/)?/, function(req, res) {
    console.log('redirecting to Server2');
    apiProxy.web(req, res, {target: ServerTwo});
});

app.listen(3000, () => {
    console.log('OK');
});