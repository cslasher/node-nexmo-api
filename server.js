var express = require('express')
var logger = require('morgan')
var app = express()
var bodyParser = require('body-parser')

var port = process.env.PORT||3000
var ip = process.env.IP||'127.0.0.1'

var request = require("request");

var sendParam =
{
	method: 'POST',
	url: 'https://rest.nexmo.com/sms/json',
	headers:
	{ 'cache-control': 'no-cache',
	'content-type': 'application/json' },
	body:
	{
		api_key: process.env.API_KEY,
		api_secret: process.env.API_SECRET,
		to: '<phoneNumber>',
		from: 'NEXMO',
		text: '測試 2！！',
		type: 'unicode'
	},
	json: true
};

var sendVerifyParam = {
	method: 'POST',
	url: 'https://api.nexmo.com/verify/json',
	headers:
	{
		'content-type': 'application/json'
	},
	body:
	{
		api_key: process.env.API_KEY,
		api_secret: process.env.API_SECRET,
		number: '<phoneNumber>',
		brand: 'Test APP'
	},
	json: true
}

var checkVerifyParam = {
	method: 'POST',
	url: 'https://api.nexmo.com/verify/check/json',
	headers:
	{
		'content-type': 'application/json' },
		body:
		{
			api_key: process.env.API_KEY,
			api_secret: process.env.API_SECRET,
			request_id: '<request_id>',
			code: '<code>'
		},
		json: true
	}

app.use(bodyParser.urlencoded({extended: false}))

app.set('view engine', 'pug')

app.get('/', function(req, res) {
	res.render('index', {title: 'Nexmo 簡訊測試'})
})

app.post('/send', function(req, res) {
	sendParam.body.to = req.body.phone
	sendParam.body.text = req.body.message
	request(sendParam, function (error, response, body) {
		if (error) throw new Error(error)

		console.log('request: ', sendParam)
  		console.log('statusCode:', response && response.statusCode) // Print the response status code if a response was received
  		console.log('body:', body) // Print the HTML for the Google homepage.
  		res.render('sendReport', {
  			title: '簡訊發送結果',
  			messageCount: body['message-count'],
  			to: body['messages'][0]['to'],
  			messageID: body['messages'][0]['message-id'],
  			status: body['messages'][0]['status'],
  			remainingBalance: body['messages'][0]['remaining-balance'],
  			messagePrice: body['messages'][0]['message-price'],
  			network: body['messages'][0]['network']
  		})
	});
})

app.post('/sendVerify', function(req, res) {
	sendVerifyParam.body.number = req.body.phone
	console.log('request: ', sendVerifyParam)
	request(sendVerifyParam, function (error, response, body) {
		if (error) throw new Error(error)

  		console.log('statusCode:', response && response.statusCode) // Print the response status code if a response was received
  		console.log('body:', body) // Print the HTML for the Google homepage.
  		res.render('sendVerifyReport', {
  			title: '驗證訊息發送結果',
  			requestID: body['request_id'],
  			status: body['status'],
  			errorText: body['error_text']
  		})
	});
})

app.post('/checkVerify', function(req, res) {
	checkVerifyParam.body.request_id = req.body.requestID
	checkVerifyParam.body.code = req.body.code
	console.log('request: ', checkVerifyParam)
	request(checkVerifyParam, function (error, response, body) {
		if (error) throw new Error(error)

  		console.log('statusCode:', response && response.statusCode) // Print the response status code if a response was received
		console.log('body:', body) // Print the HTML for the Google homepage.
		res.render('checkVerifyReport', {
			title: '驗證結果',
			eventID: body['event_id'],
			status: body['status'],
			price: body['price'],
			currency: body['currency'],
			errorText: body['error_text']
		})
	})
})

app.listen(port, function () {
	console.log(`Listening on ${ip}: ${port}...`)
})

