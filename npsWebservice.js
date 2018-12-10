"use strict"

var rp = require("request-promise")
var convert = require("xml-js")
const LICENSE_KEY = process.env.A_LIC_KEY
const API_URL = process.env.API_URL
    
const getCurrentSigns = async () => {
	try {
		console.log("NoParkingSignsWS.call: Now calling web service")
        
		let headers = {
			"User-Agent" : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36"
		}

		let result =  await rp({url: API_URL, headers: headers})
		console.log(`a result was returned: ${result}`)       
		return convert.xml2js(result, {compact: true, spaces: 4}).ArrayOfParkingSign.ParkingSign
	}
	catch( error ) {
		console.log(` NoParkingSignsWS.call caught en error ${error.statusCode}, ${error.name}`)
		return []
	}
}


module.exports = {getCurrentSigns}