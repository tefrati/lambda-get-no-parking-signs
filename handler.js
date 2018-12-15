"use strict"

require("dotenv").config()
const {getCurrentSigns, getFutureSigns} = require("./npsWebservice")
const {insertSigns} = require("./db")

const processSigns = (signs) => {
	let re = /[^0-9- ][\w ']*/
	signs.forEach(sign => {
		if (!sign.addressStreetName) {
			let result = re.exec(sign.fullAddress)
			if (result) {
				sign.addressStreetName = result[0]
				console.log(`street ${sign.addressStreetName} was found in ${sign.fullAddress}`)
			}
			else {
				console.error(`no street was found in ${sign.fullAddress}`)
			}
		}
	})
}

module.exports.getNoParkingSigns = async (event, context, callback) => {
	try {
		let currentSigns = await getCurrentSigns()
		let futureSigns = await getFutureSigns()
		processSigns(currentSigns)
		processSigns(futureSigns)
		await insertSigns(currentSigns, futureSigns)
		callback(null, {
			statusCode: 200,
			headers: { "Content-Type": "text/plain" },
			body: "Current and future signs fetched and inserted"
		})

	}
	catch (err) {
		callback(null, {
			statusCode: err.statusCode || 500,
			headers: { "Content-Type": "text/plain" },
			body: "Could not fetch no-parking signs data or write to DB. hmmm..."
		})
	}
}
