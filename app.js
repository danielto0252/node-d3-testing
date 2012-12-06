

// Require Modules that are needed //
var express = require('express');
var http = require('http');
var mysql = require('mysql');

// create an express object, app, does does all the backend
// heavy lifting like getting and posting
var app = express(); 

// configure the app with the "middleware" that we need
// middleware is software used by express to connect to other
// software components
app.configure(function() {
	/****** IMPORTANT, Order of how things are set and used in app.configure matters!!! ********/

	app.set('port', process.env.PORT || 3000); //set the port, b/c we're in the development phase it will be localhost:3000
	app.set('views', __dirname + '/views');  // you put your .jade files in your view file 
	app.set('view engine', 'jade'); // we are using the jade Template Engine to render dynamic pages
	app.use(express.logger('dev')); // used for logging errors i believe....
	app.use(express.bodyParser()); // used to extract data from the body of a POST request											 
	app.use(app.router); //always put at the end because the router is always handled last
					     // used to handle routes like get '/', etc.													
});


// DB credentials //
var HOST = 'localhost';
var PORT = 3306;
var MYSQL_USER = 'root';
var MYSQL_PASS = 'root';
var DATABASE = 'SmartClickR';
var TABLE = 'Users';

// Connect to the DB //
var connection = mysql.createConnection({
	host: HOST,
	port: PORT,
	user: MYSQL_USER,
	password: MYSQL_PASS,
	database: DATABASE,
});



var getResults = function(sqlCommand, callback) {
	connection.query(sqlCommand, function(err, out) {
		if(err) {
			console.log("Error: " + err);
			connection.destroy();
			console.log('Connection closed');
		} else {
			//console.log(output);
			callback(out);
		}
	});
}




app.get('/', function(request, response) {
	var commandExample = 'SELECT * FROM ' + TABLE + ' WHERE User_ID = ' + connection.escape(47); //connection.escape prevents from sql injections :)
	
	getResults(commandExample, function(o){
		console.log(o);

		//the method stub is response.render('page.jade', [things you want to send]);
		response.render('index.jade', { title: 'Bradlye!!',
										locals : {name : 'Hello I can be anything!',
												  data : JSON.stringify(o)}});
	});	
	

});


/*
	When response.render is called it will go into your views folder 
	and look for the layout.jade and .jade file that you are pointing to
	Where it says "block content" is where your index.jade gets inserted
*/

//create the server and listen on the specifed port!
http.createServer(app).listen(app.get('port'), function() {
	console.log("Express server listening on port " + app.get('port'));
});