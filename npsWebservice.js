"use strict"

var rp = require("request-promise")
var convert = require("xml-js")
	
const getSigns= async (apiUrl) => {
	try {
		console.log("NoParkingSignsWS.call: Now calling web service")
        
		let headers = {
			"User-Agent" : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36"
		}

		let result =  await rp({url: apiUrl, headers: headers})
		if (result.startsWith("<?xml version")) {
			let json =  convert.xml2js(result, {compact: true, spaces: 4}).ArrayOfParkingSign.ParkingSign
			let jsonResult = []
			for (let parkingSign of json) {
				let psJson = {}
				for (let property in parkingSign) {
					let value = parkingSign[property]._text
					if (property!=="woZipCode" && property!=="woPhoneNumber") { 
						if (!value) value = null
						else if (value==="true") value = true
						else if (value==="false") value = false
						else if (!isNaN(value)) value = Number(value)
					}
					if (property.startsWith("wo")) property = property[2].toLowerCase() + property.substring(3)
					psJson[property] = value
				}
				jsonResult.push(psJson)
			}
			return jsonResult
		}
		return result
	}
	catch( error ) {
		console.log(` NoParkingSignsWS.call caught en error ${error.statusCode}, ${error.name}`)
		return []
	}
}

const getCurrentSigns = async () => {
	return await getSigns(process.env.CURRENT_API_URL)
}

const getFutureSigns = async () => {
	return await getSigns(process.env.FUTURE_API_URL)
}

module.exports = {getCurrentSigns, getFutureSigns}