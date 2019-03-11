var serialport = require('serialport')

// initializing the requirements for the tcp-connection to server
var net = require('net')
var serverPort = 6969
var serverHost = 'localhost'
var gatewayPort;

//var c = net.createConnection(serverPort, serverHost);

// Using request-library for creating http requests
var request = require('request')


serialport.list(function (err, ports) {
	
	console.log("Listing available ports. Will not open /dev/ttySx -ports")
	
	ports.forEach(function(port) {
		//console.log(port.comName)
		//console.log(port.manufacturer)
		
		if (port.comName.indexOf('ttyS') === -1) {
			var serialPort = new serialport(port.comName, {
				parser: serialport.parsers.readline("\n")
			})
			
			serialPort.on('open',  function (err) {
				console.log('opened ' + port.comName)
				serialPort.on('data', function (data) {
					console.log(data)
					
					// Now this gateway only prints your data in console
					// If you want to implement your own data handling, do it here
					var formattedMessage = parseMessage(data)
					sendData(formattedMessage)
				})

			})
		}
	})
	
})



// Posting hardcoded test messages. You can comment these out when implementing your own functionality
var nodeData = {device: "TC219", description: "Wololoo"}
console.log(nodeData)
// We create a request with the following parameters. Uri is mandatory. The callback will include 
// information about what the server replied in its parameters.
request({
	uri: "http://localhost:3333/nodes",
	method: "POST",
	json: true,
	body: nodeData
}, function (error, response, body){
	console.log(response.statusCode)
	console.log(body)
})

nodeData2 = {device: "TF108", description: "Converted"}
var nodeUrl = "http://localhost:3333/nodes/id/2"
console.log(nodeUrl)
request({
	uri: nodeUrl,
	method: "PUT",
	json: true,
	body: nodeData2
}, function (error, response, body){
	console.log(response.statusCode)
	console.log(body)
})

//OwnRequests for testing--------------
var sensorData = {nodeId: 1, type: "temperature"}
request({
	uri: "http://localhost:3333/nodes/1",
	method: "POST",
	json: true,
	body: sensorData
}, function (error, response, body){
	console.log(response.statusCode)
	console.log(body)
})

var measurementData = {sensorId: 1, timestamp: "Now", value: 25}
request({
	uri: "http://localhost:3333/nodes/1/sensors/1",
	method: "POST",
	json: true,
	body: measurementData
}, function (error, response, body){
	console.log(response.statusCode)
	console.log(body)
})





function parseMessage(data)
{
	//if necessary, parse your message in such format that you can send it to server,
	// for example try JSON
	var formattedMessage = data
	return formattedMessage
}
function sendData(message)
{
	// React to your received message (from Arduino) by posting them into the server as 
	// per your API desing
}

