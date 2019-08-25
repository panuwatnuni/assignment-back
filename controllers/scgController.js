const utl = require("../utl.js")
const memoize = require("memoizee");

async function index (req, res) {
	let APIKEY = 'AIzaSyAcqST5W9qpXlwUfvJAB5aoH4-EJTfwRzE'
	newListRest = [],
	resResult = {},
	i = 0,
	tokenPage = '',
	order = 1,
	googlePathNew = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurants+in+Bangsue&sensor=false&key=${APIKEY}&pagetoken=${tokenPage}`,
	resultCurl = await utl.curlGoogle(googlePathNew)
	if (resultCurl.body.results.length > 0) {
		resultCurl.body.results.forEach( (val, key) => {
			newListRest.push({
				lat: val.geometry.location.lat
				, lng: val.geometry.location.lng
				, name: val.name
				, id: val.id
				, order: order
			})
			order++
		});
		tokenPage = resultCurl.body.next_page_token
		i++
	} 	
	resResult = {
		result: newListRest,
		nextPageToken: tokenPage
	}
	res.send(resResult)
}
function findXYZ (req, res) {
	let newArr = ['x', 5, 9, 15, 23, 'y', 'z'],
		multiplyTerms = 2,
		result = {}
		newArr.forEach((val, key) => {
			if (isNaN(val)) {
				if (isNaN(newArr[key + 1])) {
					period = (multiplyTerms * (key))
					newArr[key] = newArr[key - 1] + period
				} else {
					period = (multiplyTerms * (key + 1))
					newArr[key] = newArr[key + 1] - period
				}
				result[val] = newArr[key]
			} 	
		});
		res.send(result)
}
memoized = memoize(index, { maxAge: 60 * 1000 })
memoized2 = memoize(findXYZ, { maxAge:  60 * 1000 })
exports.index = index
exports.findXYZ = findXYZ