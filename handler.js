"use strict"

require('dotenv').config()
const {getCurrentSigns} = require("./npsWebservice")
const {insertCurrentSigns} = require("./db")

module.exports.getNoParkingSigns = async (event, context, callback) => {
  try {
    let currentSigns = await getCurrentSigns()
    console.log(`current signs (in JSON): ${JSON.stringify(currentSigns)}`)
    let message = `Got ${currentSigns.length} signs`
    if ( currentSigns.length > 0 ) {
      await insertCurrentSigns(currentSigns)
      message = "Signes fetched and inserted to DB"
    }
    callback(null, {
      statusCode: 200,
      headers: { "Content-Type": "text/plain" },
      body: message
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
