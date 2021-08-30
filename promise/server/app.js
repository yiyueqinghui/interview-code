const http = require('http');

const server = http.createServer( (req, res) => {

    setTimeout(() => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.end('ajax');
    }, 5000);

} );

server.listen(7777);