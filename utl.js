var moment = require('moment')
var request = require('request');


function now_date() { 
	let date = moment().format('YYYY-MM-DD HH:mm:ss') 
	return date
}

function curl(path, data, method) {
	// DEVELOP = http://commart.advicebkk.com/index.php/servicejob/api/insert_stcok_card
	// PRODUCTRION = http://apsn0001.advicebkk.com/index.php/servicejob/api/insert_stcok_card
	var clientServerOptions = {
		uri: path,
		body: JSON.stringify(data),
		method: method,
		headers: {
			'Content-Type': 'application/json'
		}
	}
	return new Promise((resolve, reject) => {
		request(clientServerOptions, function (error, resData) {
			// if (resData.body != '') {
				resData = resData.body.replace(/[\u200B-\u200D\uFEFF]/g, '')
				let dataRes = JSON.parse(resData)
				resolve(dataRes)
			// } 
		});
	})
}
function curlGoogle(path) {
	return new Promise((resolve, reject) => {
		request(path, function (error, response, body) {
			let result = {}
			if (!error && response.statusCode == 200) {
				result = {
					body: JSON.parse(body),
					status: 'SUCCESS'
				}
			} else {
				result = {
					body: [],
					status: 'ERROR',
					error: error
				}
			}
			resolve(result)
		});
	});
}
function reply(reply_token, msg) {
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer {JMMZdzZ247HySaZrxMUx1aDWvwdaLRkxZjdmxAerylwQlZHnjU1ep7zeBXdssxmQKE202V7i/kwPlvgg57GpvugzApCoLGZM4duCJPf4GKoN6rE7cwwqLghsmc4G7R1Ib/mL8JsLK/W2fyyOzCzJyQdB04t89/1O/w1cDnyilFU=}'
    }
    let body = JSON.stringify({
        replyToken: reply_token,
        messages: [msg]
    })
    request.post({
        url: 'https://api.line.me/v2/bot/message/reply',
        headers: headers,
        body: body
    }, (err, res, body) => {
        console.log('status = ' + res.statusCode);
    });
}
exports.curlGoogle = curlGoogle
exports.curl = curl
exports.now_date = now_date
exports.reply = reply