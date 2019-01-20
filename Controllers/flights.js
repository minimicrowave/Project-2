const axios = require("axios");


module.exports = (db) => {

    const form = (request, response) => {
        var flightNo = request.body.flightNo;
        var results;

        // round down to nearest hour for API data extraction
        var timeNow = parseInt(((new Date).getTime()) / 1000);
        // get current epoch time
        timeNow = (timeNow - (timeNow % 3600)) - 3600;
        var timeTwoHAgo = timeNow - (120 * 60);
        
        //  get all of the most recent flights available
        if (flightNo === "") {
            axios.get(`https://minimicrowave:inyourdreams@opensky-network.org/api/flights/all?begin=${timeTwoHAgo}&end=${timeNow}`).then(result => {
                results = result.data.splice(0, 61);
                // console.log(results)
            }).then(() => {
                response.render('../views/results.jsx', {
                    flights: results
                });
            })
        } else {
            axios.get(`https://minimicrowave:inyourdreams@opensky-network.org/api/flights/all?begin=${timeTwoHAgo}&end=${timeNow}`).then(result => {
    
                    results = result.data.filter(element => {
                        if (element.callsign !== null){
                            var callsign;
                            // deletes all spaces
                            callsign = element.callsign.replace(/\s+/g, '');
                            if (callsign.includes(flightNo.toUpperCase())) {
                                return element;
                            }
                        } else {
                            return [null];
                        }
                    });
    
                console.log(results);
            }).then(() => {
                response.render('../views/results.jsx', {
                    flights: results
                });
            })

        }        
    }

    const maps = (request, response) => {   
        var icaoNo = (request.body.flight).replace(/\s+/g, '');
        var user = request.cookies['user'];

        axios.get(`https://minimicrowave:inyourdreams@opensky-network.org/api/tracks/all?icao24=${icaoNo}&time=0`).then(result => {
            // console.log(result.data);
                db.users.addFlights(icaoNo, user, (error, queryResult) => {
                    console.log(queryResult.flightno);
                    // var flights = response.cookie
                })


        })
            
        
    }

    // Export controller functions as a module
    return {
        form,
        maps
    };
}