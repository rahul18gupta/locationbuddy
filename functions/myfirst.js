var http = require('http');
var dt = require('./walkscoreapi');

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    
    dt.myWalkScore("1119%8th%20Avenue%20Seattle%20WA%2098101",
    47.6085, -122.3295, (output) => {
    console.log(output);
     res.write("Hello: " + output.walkscore)
    });
    // res.write("The date and time are currently: " + output);
}).listen(8080);
