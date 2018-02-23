exports.nameCombine = function(obj) {
  return obj['street-address'] + ", " + obj['city'], ", " + obj['admin-area'] + ", " + obj['zip-code']
}
