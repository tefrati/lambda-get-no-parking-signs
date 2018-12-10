"use strict"
const MongoClient = require("mongodb").MongoClient

const insertCurrentSigns = async (signs) => {
	let client
	try {
		client = await MongoClient.connect (process.env.DB_CONNECTION, { useNewUrlParser: true })
		let db = client.db(process.env.HobokenParking)
		let collection = await db.collection(process.env.DB_COLLECTION)
		await collection.insertOne( { fetchDate: new Date(Date.now()).toISOString(), signs } )
	}
	catch (err) {
		console.log(`couldn't connect or insert to DB. Err=${err}`)
	}	
	finally {
		client.close()
	}
}

module.exports = {insertCurrentSigns}