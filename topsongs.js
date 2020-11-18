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
	promptOptions();
});

const promptOptions = async () => {
	const answers = await inquirer
		.prompt([
			{
				type: "list",
				name: "queryoption",
				message:
					"Please select how you would like to query the top songs database",
				choices: [
					"Query all songs by a particular artist",
					"Query all artists which appear in the top 5000 more than once",
					"Query the information for a specific song",
					"Exit",
				],
			},
		])
		.then((answer) => {
			if (answer.queryoption == "Query all songs by a particular artist") {
				artist();
			} else if (
				answer.queryoption ==
				"Query all artists which appear in the top 5000 more than once"
			) {
				moreThanOnce();
			} else if (
				answer.queryoption == "Query the information for a specific song"
			) {
				specificSong();
			} else if (answer.queryoption == "Exit") {
				console.log("Thank you for using Top 500!");
				connection.end();
			}
		});
};

const artist = () => {
	const answer = inquirer
		.prompt([
			{
				type: "input",
				name: "artistname",
				message: "What arists songs would you like to query?",
			},
		])
		.then((answer) => {
			var query = "SELECT position, song, year FROM top5000 WHERE ?";
			connection.query(query, { artist: answer.artistname }, function (
				err,
				res
			) {
				if (err) throw err;
				console.table(res);
			});
			promptOptions();
		});
};

const moreThanOnce = () => {
	var query = "SELECT artist FROM top5000 GROUP BY artist HAVING COUNT(*) > 1";
	connection.query(query, function (err, res) {
		if (err) throw err;
		console.table(res);
		// res.map((record) => console.log(`Artist: ${record.artist}`));
		promptOptions();
	});
};

//   A query which returns all artists who appear within the top 5000 more than once

//   A query which returns all data contained within a specific range

//  A query which searches for a specific song in the top 5000 and returns the data for it
