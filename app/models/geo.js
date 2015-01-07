var Q = require('q'),
    http = require('http'),
    request = require('request');

var google_api_key = 'AIzaSyC13utbNoCJRoxy-nqPXXOIftx-XBLVRU0';

exports.getCoords = function(address) {

    var deferred = Q.defer();

    var url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&key=' + google_api_key;
    request.get(url,{},function(err,res,body){

        if(!err){
            var response = JSON.parse(body);
            if(response.status === 'OK'){
                var coords = response.results[0].geometry.location;
            deferred.resolve(coords);
            }
            else{
                deferred.reject(response.status);
            }
        }
        else{
            deferred.reject(err);
        }
    });

    return deferred.promise;
};