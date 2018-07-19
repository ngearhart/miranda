(function() {
    
    let moment = require('moment-timezone');
    
    var http = require("http");
    var https = require("https");
    
    const WEATHER_API_KEY = "3123c47af54da02883183b8f2e6c79d9";
    const TIME_API_KEY = "T8INAXCO43HJ";

    module.exports.parse = (data, onComplete) => {
        switch(data.method) {
            case "time":
                getTime(data.info, onComplete);
            break;
            case "weather":
            getWeatherString(data, onComplete);
            break;
        }
    };

    function getTime(info, onComplete) {
        var location = JSON.parse(info).location;
        if (location) {
            getTimeZone(location, result => {
                var zone = moment.tz.zone(result);
                if (!zone) {
                    onComplete("I could not find that time zone.");
                    return;
                }
                onComplete("It is " + moment.tz(result).format("h:mm A") + " in " + location + " right now.");
            });
        }
        else {
            onComplete("It is " + moment.tz("America/New_York").format("h:mm A") + ".");
        }
    }
    
    /**
     * getJSON:  REST get request returning JSON object(s)
     * @param options: http options object
     * @param callback: callback to pass the results JSON object(s) back
     */
    function doHttpGet(options, onResult)
    {
        console.log("rest::getJSON");
    
        var port = options.port == 443 ? https : http;
        var req = port.request(options, function(res)
        {
            var output = '';
            console.log(options.host + ':' + res.statusCode);
            res.setEncoding('utf8');
    
            res.on('data', function (chunk) {
                output += chunk;
            });
    
            res.on('end', function() {
                var obj = JSON.parse(output);
                onResult(res.statusCode, obj);
            });
        });
    
        req.on('error', function(err) {
           // res.send('error: ' + err.message);
        });
    
        req.end();
    }
    
    function convertTemp(kelvin) {
        return Math.floor(((kelvin * 9 / 5) - 459.67) * 10) / 10;
    }
    
    function getWeatherString(headers, onComplete) {
        var data = JSON.parse(headers.info);

        var options = {
            host: 'api.openweathermap.org',
            port: 443,
            path: '/data/2.5/weather?appid=' + WEATHER_API_KEY + "&q=" + data.location.replace(" ", "%20"),
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };

        doHttpGet(options, (code, data) => { 
            try {
                var weather = data.weather[0].description;
                var temperature = convertTemp(data.main.temp);
                var min = convertTemp(data.main.temp_min);
                var max = convertTemp(data.main.temp_max);
                
                onComplete("The weather is " + weather + " with a current temperature of " + temperature + " degrees. The high is " + max + " degrees and the low is " + min + " degrees.");
            } catch(e) {
                onComplete("I could not find the weather because " + data.message + ".");
            }
        });
    }

    function getTimeZone(city, onComplete) {

        // First, get long/lat
        var options = {
            host: 'api.openweathermap.org',
            port: 443,
            path: '/data/2.5/weather?appid=' + WEATHER_API_KEY + "&q=" + city.replace(" ", "%20"),
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        doHttpGet(options, (code, data) => {
            try {
                var lon = data.coord.lon;
                var lat = data.coord.lat;
            } catch(e) {
                onComplete("An exception occured: " + JSON.stringify(data));
                return;
            }

            var options2 = {
                host: 'api.timezonedb.com',
                port: 80,
                path: '/v2/get-time-zone?key=' + TIME_API_KEY + '&format=json&by=position&lat=' + lat + "&lng=" + lon,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            doHttpGet(options2, (code2, data2) => {
                try {
                    onComplete(data2.zoneName);
                } catch(e) {
                    onComplete("An exception occured: " + JSON.stringify(data));
                }
            });
        });
    }
        
}());