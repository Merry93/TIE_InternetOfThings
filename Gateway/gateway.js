var serialport = require('serialport')

// initializing the requirements for the tcp-connection to server
var net = require('net')
var serverPort = 6969
var serverHost = 'localhost'
var gatewayPort;

var c = net.createConnection(serverPort, serverHost);


serialport.list(function (err, ports) {
	
	console.log("Listing available ports. Will not open /dev/ttySx -ports")
	
	ports.forEach(function(port) {
		console.log(port.comName)
		console.log(port.manufacturer)
		
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

// Test message. You can comment this out when you get your actual data flowing
var data = {device: "Oma", sensor: "Valo", value: 12}
var dataJSON = JSON.stringify(data)
console.log(dataJSON)
sendData(dataJSON)
// Test message sending ends


c.on('data', function(data) {
	console.log("Server sent some data! Yay!")
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
	c.on('connect', function(){
		c.write(message)
	})
}

