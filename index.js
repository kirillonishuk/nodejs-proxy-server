const express = require('express');
const https = require('https');
const fs = require('fs');

const app = express();
const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';
const config = require('./config.json')[mode];

const httpProxy = require('http-proxy');

const apiProxyChat = httpProxy.createProxyServer({
    target: `http://${config.chatHost}:${config.chatPort}`
});
const apiProxyBot = httpProxy.createProxyServer({
    target: `http://${config.botHost}:${config.botPort}`
});

app.all(/^\/bot(\/)?/, function (req, res) {
    apiProxyBot.web(req, res);
});

app.all(/^\/chat(\/)?/, function (req, res) {
    apiProxyChat.web(req, res);
});

app.use('/ws', function ( req, res ) {
    apiProxyBot.web( req, res, { target: `http://${config.botHost}:${config.botHost}/ws` } );
});

const credentials = {
    key: fs.readFileSync('./https/server.key', 'utf8'),
    cert: fs.readFileSync('./https/server.crt', 'utf8')
};
const httpsServer = https.createServer(credentials, app);

httpsServer.on('upgrade', function( req, socket, head ) {
	apiProxyBot.ws( req, socket, head );
});

httpsServer.listen(443, () => {
    console.log('Proxy server running!');
});
