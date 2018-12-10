"use strict"
const MongoClient = require("mongodb").MongoClient

const insertSigns = async (currentSigns, futureSigns) => {
	let client
	try {
		client = await MongoClient.connect (process.env.DB_CONNECTION, { useNewUrlParser: true })
		let db = client.db(process.env.HobokenParking)
		let currentCollection = await db.collection(process.env.DB_CURRENT_LOCATION_COLLECTION)
		await currentCollection.insertOne( { fetchDate: new Date(Date.now()).toISOString(), {signs: currentSigns} } )
		let futureCollection = await db.collection(process.env.DB_FUTURE_LOCATION_COLLECTION)
		await futureCollection.insertOne( { fetchDate: new Date(Date.now()).toISOString(), {signs: futureSigns} } )
	}
	catch (err) {
		console.log(`couldn't connect or insert to DB. Err=${err}`)
	}	
	finally {
		client.close()
	}
}

module.exports = {insertSigns}