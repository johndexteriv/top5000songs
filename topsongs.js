var inquirer = require("inquirer");
var mysql = require("mysql");
const { connect } = require("tls");

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "root",
	database: "top_songsDB",
});

connection.connect(function (err) {
	if (err) throw err;
	console.log("connected as id" + connection.threadId + "\n");
});

//  A query which returns all data for songs sung by a specific artist

//   A query which returns all artists who appear within the top 5000 more than once

//   A query which returns all data contained within a specific range

//  A query which searches for a specific song in the top 5000 and returns the data for it
