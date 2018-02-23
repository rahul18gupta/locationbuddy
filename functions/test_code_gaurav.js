var http = require('http');
var maps = require('./maps_api.js')
var util = require('./util.js')


var origin = {"country": "United States of America",
"city": "Mountain View",
"admin-area": "California",
"business-name": "Google",
"street-address": "4770 blanco drive",
"zip-code": "95129"};

var destination = {"country": "United States of America",
"city": "Milpitas",
"admin-area": "California",
"business-name": "Google",
"street-address": "500 Amalfi Loop",
"zip-code": "95035"};

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write('Hello World!');
    // var origin = '1600 Amphitheatre Parkway, Mountain View, CA'
    // var origin = util.nameCombine(test_obj); 
    // var destination = '500 Amalfi Loop, Milpitas, CA'
    maps.moringCommuteTime(origin, destination, (response) => {console.log(response);  });
    maps.eveningCommuteTime(destination, origin, (response) => {console.log(response);  });

    lat = 47.6085;
    lng = -122.3295;
    //maps.getAddress(lat, lng, (response) => {console.log(response);  });
    //maps.getLatLng(origin, (response) => {console.log(response);  });
    res.end();
}).listen(8080);
