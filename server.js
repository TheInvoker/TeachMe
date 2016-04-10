var express = require('express');
var app = express();





app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
	var dest = 'index.html';
	res.sendFile(dest, { root: __dirname });
});

app.post('/getlocations', function (req, res) {
	console.log("worked");
	res.end(JSON.stringify({
		'status':'ok',
		'data':[
			{
				'pos':{lat: 48.8620722, lng: 2.352047},
				'type':'request',
				'text':'I want to learn how to do a cool coin magic trick'
			},
			{
				'pos':{lat: 44.28952958093682, lng: 6.152559438984804},
				'type':'request',
				'text':'I want to learn how to do a cool coin magic trick'
			},
			{
				'pos':{lat: 49.28952958093682, lng: -1.1501188139848408},
				'type':'request',
				'text':'I want to learn how to do a cool coin magic trick'
			},
			{
				'pos':{lat: 44.28952958093682, lng: -1.1501188139848408},
				'type':'request',
				'text':'I want to learn how to do a cool coin magic trick'
			}
		]
	}));
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