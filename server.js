var express = require('express')
var logger = require('morgan')
var app = express()
var bodyParser = require('body-parser')

var port = process.env.PORT||3000
var ip = process.env.IP||'127.0.0.1'

var request = require("request");

var options = {
	method: 'POST',
	url: 'https://rest.nexmo.com/sms/json',
	headers:
	{ 'cache-control': 'no-cache',
	'content-type': 'application/json' },
	body:
	{ api_key: process.env.API_KEY,
		api_secret: process.env.API_SECRET,
		to: '886973013134',
		from: 'NEXMO',
		text: '測試 2！！',
		type: 'unicode' },
		json: true
	};

// request(options, function (error, response, body) {
//   if (error) throw new Error(error);

//   console.log(body);
// });


app.use(bodyParser.urlencoded({extended: false}))

app.set('view engine', 'pug')

app.get('/', function(req, res) {
	res.render('send', {title: '發送簡訊'})
})

app.post('/send', function(req, res) {
	options.body.to = req.body.phone
	options.body.text = req.body.message
	request(options, function (error, response, body) {
	  if (error) throw new Error(error)

	  console.log('statusCode:', response && response.statusCode) // Print the response status code if a response was received
	  console.log('body:', body) // Print the HTML for the Google homepage.
	  res.render('sendReport', {
	  	messageCount: body['message-count'],
	  	to: body['messages'][0]['to'],
	  	messageId: body['messages'][0]['message-id'],
	  	status: body['messages'][0]['status'],
	  	remainingBalance: body['messages'][0]['remaining-balance'],
	  	messagePrice: body['messages'][0]['message-price'],
	  	network: body['messages'][0]['network']
	  })
	});

})

app.listen(port, function () {
	console.log(`Listening on ${ip}: ${port}...`)
})

