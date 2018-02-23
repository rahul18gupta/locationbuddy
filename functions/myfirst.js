var http = require('http');
var dt = require('./walkscoreapi');
var cs = require('./crimesnew');

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    
    dt.myWalkScore("762-798 Spring St, Seattle, WA 98104, US",
    47.6085, -122.3295, (output) => {
    console.log(output);
     res.write("Hello: " + output.walkscore)
    });

    cs.getCrimes(
    37.307441,
    -121.989322,
    (output) => {
    console.log(output);
    });
    // res.write("The date and time are currently: " + output);
}).listen(8080);
