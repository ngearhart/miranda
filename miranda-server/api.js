(function() {
    
    let moment = require('moment-timezone');
    
    var http = require("http");
    var https = require("https");
    
    const WEATHER_API_KEY = "3123c47af54da02883183b8f2e6c79d9";
    const TIME_API_KEY = "T8INAXCO43HJ";

    const MARVEL_PUBLIC = "abffb0844ec41c198c5aa88cec8d0be3";
    const MARVEL_PRIVATE = "035d0f79438f92f91ecc8957242bf300cd1e23c3";
    let crypto = require('crypto');

    let wikipedia = require('wikipedia-js');
    let xml2js = require('xml2js');

    module.exports.parse = (data, onComplete) => {
        switch(data.method) {
            case "time":
                getTime(data.info, onComplete);
                break;
            case "weather":
                getWeatherString(data, onComplete);
                break;
            case "marvel":
                marvel_GetHero(data.name, onComplete);
                break;
            case "wikipedia":
                search(JSON.parse(data.info).query, result => {
                    if (!result) {
                        onComplete("Not found"); 
                        return;
                    }
                    // var dataResult = JSON.parse(result).query.pages;
                    // var text = dataResult[Object.keys(dataResult)[0]].revisions[0]["*"];
                    // text = text.replace("{{", "").replace("}}", "").replace("[[", "").replace("]]", "");

                    result = result.replace(/<\/?[^>]+(>|$)/g, "");
                    result = result.replace(/\[\/?[^\]]+(\]|$)/g, "");
                    result = result.replace(/\(\/?[^\)]+(\)|$)/g, "").replace("()", "").replace("  ", " ").trim();

                    if (result.length > 1000) {
                        var spl = result.split(".");
                        result = "";
                        for (let i = 0; i < 4; i++)
                            result += spl[i];
                    }

                    if (result.includes("can refer to:")) {
                        result = "You need to be more specific";
                    }

                    onComplete(result);
                    //xml2js.parseString(result, result => console.log(result));
                });
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

    function search(query, onComplete) {
        wikipedia.searchArticle({query: query, format: "html", summaryOnly: "true"}, (err, text) => {
            if (!text) {
                wikipedia.searchArticle({query: query.replace(" ", "_"), format: "html", summaryOnly: "true"}, (err, text) => {
                    onComplete(text);
                });
                return;
            }
            onComplete(text);
        });
        //wikipedia.page.description(query, response => onComplete(response));
    }

    function marvel_GetHero(name, onComplete) {
        var hero = {};
        var tries = 0;
        var getFunction = function() {
            var dateMillis = new Date().getMilliseconds();
            var options = {
                host: 'gateway.marvel.com',
                port: 80,
                path: '/v1/public/characters?ts=' + dateMillis + "&apikey=" + MARVEL_PUBLIC + "&hash=" + crypto.createHash('md5').update(dateMillis + MARVEL_PRIVATE + MARVEL_PUBLIC).digest('hex'),
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            
            switch(tries) {
                case 1:
                    options.path += "&nameStartsWith=" + name.replace(" ", "-");
                    break;
                case 2: options.path += "&nameStartsWith=" + (name.substring(0, name.lastIndexOf("man")) + "-" + name.substring(name.lastIndexOf("man"))).replace(" ", "%20");
                    break; 
                case 3: onComplete(null);
                    return;
                default:
                    options.path += "&nameStartsWith=" + name.replace(" ", "%20");
            }

            doHttpGet(options, (code, data) => {
                hero = data.data.results[0];
                if (!hero) {
                    tries++;
                    getFunction();
                    return;
                } else onComplete(hero);
            });
        };
        getFunction();
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