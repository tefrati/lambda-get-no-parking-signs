const turf = require("@turf/turf")
const geolib = require("geolib")
const googleMapsClient = require("@google/maps").createClient({
	key: process.env.GOOGLE_MAPS_JS_API_KEY,
	Promise: Promise
})

const addressRangeToPolygon = async (numberOfSigns, addressNumberStart, addressStreetName, city = "Hoboken", state = "NJ") => {
	// find geo coordinates for each address. 
	// create polygon from points:
	//    if one point, use radius
	//    for more than one point, for each adjacent points, create a box: add padding based on direction and orthogonal
	//	  comine all boxes to polygon
	let locations = []
	let addressNumber = addressNumberStart
	for (let i = 0; i < numberOfSigns; i++) {
		try {
			let fullAddress = `${addressNumber} ${addressStreetName}, ${city}, ${state}`
			let response = await googleMapsClient.geocode({ address: fullAddress }).asPromise()
			let location = response.json.results[0].geometry.location
			locations.push([location.lng, location.lat])
		}
		catch (err) {
			console.log(err)
		}
		finally {
			addressNumber += 2
		}
	}
	if (numberOfSigns == 1) {
		const center = locations[0]
		const radius = 0.003 // 3 metters 
		return turf.circle(center, radius)
	}
	let polygons = []
	for (let i = 0; i < locations.length - 1; i++) {
		const bearing = Math.abs(turf.bearing(locations[i], locations[i + 1]))
		const geolibPoint0 = { lat: locations[i][1], lon: locations[i][0] }
		const geolibPoint1 = { lat: locations[i + 1][1], lon: locations[i + 1][0] }
		const newPoint0 = geolib.computeDestinationPoint(geolibPoint0, 3, (bearing + 90) % 180)
		const newPoint1 = geolib.computeDestinationPoint(geolibPoint0, 3, Math.abs(bearing - 90) % 180)
		const newPoint2 = geolib.computeDestinationPoint(geolibPoint1, 3, (bearing + 90) % 180)
		const newPoint3 = geolib.computeDestinationPoint(geolibPoint1, 3, Math.abs(bearing - 90) % 180)
		polygons.push(turf.polygon(
			[[
				[newPoint0.longitude, newPoint0.latitude],
				[newPoint1.longitude, newPoint1.latitude],
				[newPoint2.longitude, newPoint2.latitude],
				[newPoint3.longitude, newPoint3.latitude]
			]])
		)
		const unionedPolygon = turf.union(...polygons)
		return unionedPolygon
	}
}

// location - {lat:, lan:}
const coordinatesToAddress = async (location) => {
	let response = await googleMapsClient.geocode({ location }).asPromise()[0]
	console.log(response)
}

module.exports = { coordinatesToAddress }