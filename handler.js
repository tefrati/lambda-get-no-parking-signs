"use strict"

require("dotenv").config()
const {getCurrentSigns, getFutureSigns} = require("./npsWebservice")
const {insertSigns} = require("./db")

module.exports.getNoParkingSigns = async (event, context, callback) => {
	try {
		let currentSigns = await getCurrentSigns()
		let futureSigns = await getFutureSigns()
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
