var express = require('express'),
	app = express(),
	port = process.env.PORT || 3333,
	bodyParser = require('body-parser');
	
	


var sqlitedb = require('./database.js')


app.use(bodyParser.json());

// Let us create some routes 

//The example here shows all the nodes in the system and allows for adding new node
app.route('/nodes')
	.get(list_all_nodes)
	.post(add_new_node)
	
app.route('/nodes/id/:nodeId')
	.get(get_single_node_information)
	.put(update_node_details)
	
//Add your own routes here, based on your API -design
//app.route('/path/that/can/be/also/long/with/parameters/:Parameter')
//	.get(function-that-retrieves-information)
//	.post(function-that-creates-information)
//	.put(function-that-updates-information)
//	.delete(function-that-deletes-information)
app.route('/nodes/:nodeId/sensors/:sensorId')
	.get(list_all_measurements)
	.post(add_new_measurement)
	
app.route('/nodes/:nodeId')
	.post(add_new_sensor)


app.listen(port);

console.log("RESTful API server")

//Own Functions--------------------------
function list_all_measurements(req, res)
{
	
	var results = sqlitedb.getMeasurements()
		.then(function(results){
			console.log(results)
			res.json(results)
		})
		.catch(function(response) {console.log("Catch response", response)})


}

function add_new_sensor(req, res)
{
	console.log("add_new_sensor")
	console.log(req.body)
	var results = sqlitedb.addSensor(req.body.nodeId, req.body.type)
		.then(function(results){
			console.log("R: ", results)
			res.statusCode = 200;
			res.json({nodeId: results})
			//console.log(res)
		})
		.catch(function(response) {
			res.statusCode = 500;
			res.json({errors: response})
			//console.log(res)
		})
}

function add_new_measurement(req, res)
{
	console.log("add_new_measurement")
	console.log(req.body)
	var results = sqlitedb.addMeasurement(req.body.sensorId, req.body.timestamp, req.body.value)
		.then(function(results){
			console.log("R: ", results)
			res.statusCode = 200;
			res.json({nodeId: results})
			//console.log(res)
		})
		.catch(function(response) {
			res.statusCode = 500;
			res.json({errors: response})
			//console.log(res)
		})
}

// Example of requesting possible multiple rows of data. You can test this in web server by navigating to
// localhost:3333/nodes
function list_all_nodes(req, res)
{
	
	var results = sqlitedb.getNodes()
		.then(function(results){
			console.log(results)
			res.json(results)
		})
		.catch(function(response) {console.log("Catch response", response)})


}

// Example of adding new node, this makes the assumption that the POST-message has json-
//  object in its body and the json object contains fields device and description. 
// Device will be used as the NodeName in the database and description will be Description
// This can be tested with the hardcoded POST example in gateway-api.js
function add_new_node(req, res)
{
	console.log(req.body)
	var results = sqlitedb.addNode(req.body.device, req.body.description)
		.then(function(results){
			console.log("R: ", results)
			res.statusCode = 200;
			res.json({nodeId: results})
			//console.log(res)
		})
		.catch(function(response) {
			res.statusCode = 500;
			res.json({errors: response})
			//console.log(res)
		})
}

// Example of requesting information about single node based on its id. This can be tested by navigating
// in browser to localhost:3333/nodes/id/2 or any other node id available in database. 
// The request will include the parameter nodeId in its path because the route was defined as /nodes/id/:nodeId
// and as you can see, that is used with req.params.nodeId
function get_single_node_information(req, res)
{
	var results = sqlitedb.getNode(req.params.nodeId)
		.then(function(results){
			console.log(results)
			res.json(results)
		})
		.catch(function(response) {console.log("Catch: ", reponse)})
}

// Example of updating information of single resource. This can be tested with the hardcoded PUT example
// in the gateway-api.js. This again gets the nodeId in the path. In addition, it assumes that the request has json
// object in the body that includes fields device and description
function update_node_details(req, res)
{
	console.log(req.params)
	var results = sqlitedb.updateNode(req.params.nodeId, req.body.device, req.body.description)
		.then(function(results){
			console.log(results)
			res.statusCode = 200;
			res.json({response: results})
		})
		.catch(function(response){
			res.statusCode = 500;
			res.json({errors: response})
		})
}
