exports.getPrice = function (addressObj, callback) {

  var address = addressObj['street-address']
  var cityzip = addressObj['city'] + ", " + addressObj['zip-code']

  const https = require("https");
  var convert = require('xml2json');
  const url =
    `https://www.zillow.com/webservice/GetDeepSearchResults.htm?zws-id=X1-ZWz1g9gmthacy3_a2eph&address=${address}&citystatezip=${cityzip}`;

  https.get(url, res => {
      res.setEncoding("utf8");
      let body = "";
      res.on("data", data => {
          body += data;
          });
      res.on("end", () => {
          console.dir(url);
          var json = JSON.parse(convert.toJson(body));
          // console.dir(json);
          var zestimate = json['SearchResults:searchresults'].response.results.result.zestimate.amount.$t;
          // console.dir(zestimate);
	  callback.call(this, zestimate);
          });
      });

}
