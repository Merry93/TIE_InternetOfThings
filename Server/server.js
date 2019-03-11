// For tcp-server
var net = require('net')

// For socket io
var express = require('express')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)



// ------- PORT CONFIGURATIONS ------------
// Host IP for server
var HOST = '127.0.0.1'
// Listens on
var PORT = 6969



// -------- TCP SERVER ----------
var server = net.createServer( function(socket) {
	
	console.log("Server listening on " + PORT)
	socket.on('data', function(rawdata) {
		
		//Depending on your data coming from gateway, you might need to parse your data with different 
		// function. The current implementation assumes JSON that has decvice, sensor and value -fields.
		// var data = parseRawdata()
		
		var  data = JSON.parse(rawdata.toString())
		console.log(data)
		
		// check for existing orders and forward the measurement data to the clients waiting for it
		// You might need to modify this call if the fields in your received data are different
		var results = searchOrder(data.device, data.sensor)
		
		if (results)
		{
			results.forEach(function(order){
				console.log("Sending data to: " + order.clientId)
				io.to(order.clientId).emit('DataResponse', data)
			})
		}
	})
	
}).listen(PORT, HOST); 

function parseRawdata(rawdata)
{
	// Your implementation here
}



// ----------- SOCKET-IO , font end communication -------------

var clients = []


console.log('Using socket io');
io.on('connection', function(socketio){
	console.log('Client connected, id: ' + socketio.id)
	clients.push(socketio)
	
	socketio.on('disconnect', function() {
		console.log('Client disconnected, id ' + socketio.id)
	})
	
	// Receiving order information from the frontend
	socketio.on('DataRequest', function(requestParams){
		var device = requestParams['device']
		var sensor = requestParams['sensor']
		console.log('Order received with params: ' , device, sensor)
		
		createOrder(device, sensor, socketio.id)
		
	})
	
})


app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

http.listen(8001, function(){
    console.log('Listening on 8001');
});


// --------- ORDER HANDLING ----------
var orders = {};

// Server keeps tab on data orders from different clients. It identifies specific data order based on unique
	// combination of the data identifiers, in this case the device and sensor
function createOrder(device, sensor, clientId)
{
	var order = {'device': device, 'sensor': sensor, 'clientId': clientId}
	
	combinationKey = createKey(device, sensor)
	
	// If order about specific device and sensor exist, the new client is added to the list of clients who
	// are ordering data.
	// If client is first to order specific data, new key is added and the client's order will be first in the array
	if ( combinationKey in orders )
	{
		orders[combinationKey].push(order)
	}
	else
	{
		orders[combinationKey] = [order]
	}
}

// Super stupid key creator, just sums the device and sensorname to form one identifier for the combination
function createKey(device, sensor)
{
	return (device+sensor)
}

// Returns array of orders
function searchOrder(device, sensor)
{
	return orders[createKey(device, sensor)]
}