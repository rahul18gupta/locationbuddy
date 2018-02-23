exports.myWalkScore = function(address, lat, lng, callback) {
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
 //   output.walkscore = body.walkscore
    callback.call(this, body);
  });
});
}
