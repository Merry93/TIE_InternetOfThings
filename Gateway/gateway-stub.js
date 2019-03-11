var serialport = require('serialport')
//var SerialPort = serialport.SerialPort


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
				})

			})
		}
	})
	
})