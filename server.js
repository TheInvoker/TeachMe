var express = require('express');
var app = express();
var qs = require('querystring');


function random (low, high) {
    return Math.random() * (high - low) + low;
}


app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
	var dest = 'index.html';
	res.sendFile(dest, { root: __dirname });
});

app.post('/getlocations', function (req, res) {
	
	var body = '';

	req.on('data', function (data) {
		body += data;

		// Too much POST data, kill the connection!
		// 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
		if (body.length > 1e6)
			req.connection.destroy();
	});

	req.on('end', function () {
		var post = qs.parse(body);
		var lat = parseFloat(post.lat);
		var lng = parseFloat(post.lng);
		var mi = -0.01, ma = 0.01;
		
		var dataList = [
			{
				'pos':{lat: lat+random(mi,ma), lng: lng+random(mi,ma)},
				'type':'request',
				'text':'I want to learn how to do a cool coin magic trick'
			},
			{
				'pos':{lat: lat+random(mi,ma), lng: lng+random(mi,ma)},
				'type':'teach',
				'text':'I can teach you to meditate'
			},
			{
				'pos':{lat: lat+random(mi,ma), lng: lng+random(mi,ma)},
				'type':'request',
				'text':'I want to learn how tie a tie'
			},
			{
				'pos':{lat: lat+random(mi,ma), lng: lng+random(mi,ma)},
				'type':'teach',
				'text':'I can help you with your resume'
			}
		];
		
		res.end(JSON.stringify({
			'status':'ok',
			'data': dataList
		}));
	});
});

var server = app.listen(3000, function () {
	var host = server.address().address;
	var port = server.address().port;

	console.log('TeachMe started at http://%s:%s', host, port);
});







var io = require('socket.io').listen(server);

io.on('connection', function(socket){
	console.log('a user connected');

	socket.on('disconnect', function() {
		console.log('a user left');
	});
});