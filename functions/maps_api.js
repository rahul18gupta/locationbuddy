var googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyCeijhr1teyOskO_PeMM_B0GbRfieWb8EE'
});

function nameCombine(obj) {
  return obj['street-address'] + ", " + obj['city'], ", " + obj['admin-area'] + ", " + obj['zip-code']
};

function morningTime() {
  var date = new Date();
  date.setHours(9);
  return date.getTime();
};

function eveningTime() {
  var date = new Date();
  date.setHours(18);
  return date.getTime();
};

exports.moringCommuteTime = function (origin, destination, callback) {
  googleMapsClient.directions({
    //origin: '1600 Amphitheatre Parkway, Mountain View, CA',
    //destination: '500 Amalfi Loop, Milpitas, CA',
    origin: nameCombine(origin),
    destination: nameCombine(destination),
    mode: 'driving',
    departure_time: morningTime(), 
  }, function(err, response) {
    if (!err) {
      callback.call(this, "Average Commute Time Here to Office: " + response.json.routes[0].legs[0].duration.text);
      return;
    }
    callback.call(this, JSON.stringify(err) + "");
  });
};

exports.eveningCommuteTime = function (origin, destination, callback) {
  googleMapsClient.directions({
    //origin: '1600 Amphitheatre Parkway, Mountain View, CA',
    //destination: '500 Amalfi Loop, Milpitas, CA',
    origin: nameCombine(origin),
    destination: nameCombine(destination),
    mode: 'driving',
    departure_time: eveningTime(), 
  }, function(err, response) {
    if (!err) {
      callback.call(this, "Average Commute Time from Office to Here: " + response.json.routes[0].legs[0].duration.text);
    }
  });
};

exports.getAddress = function(lat, lng, callback) {
    googleMapsClient.reverseGeocode({
    'latlng' : [lat, lng],
  }, function(err, response) {
    if (!err) {
      // console.log(response.results[0]);
      callback.call(this, response.json.results[0].formatted_address);
    }
  });
};

exports.getLatLng = function(address, callback) {
    googleMapsClient.geocode({
    'address' : address,
  }, function(err, response) {
    if (!err) {
      // console.log(response.results[0]);
      callback.call(this, response.json.results[0].geometry.location);
    }
  });
};


