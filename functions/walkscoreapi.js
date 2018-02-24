var util = require('./util.js')
var maps = require('./maps_api.js')

exports.myWalkScore = function(addressObj, callback) {
  var address = util.nameCombine(addressObj)
  maps.getLatLng(address, (response) => {
   var lat = response.lat; var lng = response.lng;

  const http = require("http");

const url =
  "http://api.walkscore.com/score?format=json&address=" + address + "&lat=" + lat + "&lon=" + lng + "&transit=1&bike=1&wsapikey=5dfa918793c49b65b08f16b54acce435";

http.get(url, res => {
  res.setEncoding("utf8");
  let body = "";
  res.on("data", data => {
    body += data;
  });

  res.on("end", () => {
    var output = new Object();
    body = JSON.parse(body);
    callback.call(this, `Walkscore is ${body.walkscore}. Area is described as "${body.description}".`);
  });
});

   });

}
