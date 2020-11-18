const { resolveCname } = require("dns");
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

const promptOptions = () => {
	inquirer
		.prompt([
			{
				type: "list",
				name: "action",
				message:
					"Please select how you would like to query the top songs database",
				choices: [
					"Query all songs by a particular artist",
					"Query all artists which appear in the top 5000 more than once",
					"Query data within a specific range",
					"Query the information for a specific song",
					"Exit",
				],
			},
		])
		.then((answer) => {
			switch (answer.action) {
				case "Query all songs by a particular artist":
					artist();
					break;

				case "Query all artists which appear in the top 5000 more than once":
					moreThanOnce();
					break;

				case "Query data within a specific range":
					rangeSearch();
					break;

				case "Query the information for a specific song":
					specificSong();
					break;

				case "Exit":
					connection.end();
					break;
			}
		});
};

const artist = () => {
	inquirer
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

const rangeSearch = () => {
	inquirer
		.prompt([
			{
				name: "start",
				type: "input",
				message: "Enter starting postion: ",
				validate: (value) => {
					if (isNaN(value) === false) {
						return true;
					}
					return false;
				},
			},
			{
				name: "end",
				type: "input",
				message: "Enter ending position: ",
				validate: (value) => {
					if (isNaN(value) === false) {
						return true;
					}
					return false;
				},
			},
		])
		.then((answer) => {
			const query =
				"SELECT position,song,artist,year FROM top5000 WHERE position BETWEEN ? AND ?";
			connection.query(query, [answer.start, answer.end], function (err, res) {
				if (err) throw err;
				res.map((record) =>
					console.log(
						`Positon: ${record.position} || Song: ${record.song} || Artist: ${record.artist} || Year: ${record.year}`
					)
				);
				// Other option to build tabled res
				// console.table(res);
				promptOptions();
			});
		});
};

const specificSong = () => {
	inquirer
		.prompt({
			name: "song",
			type: "input",
			message: "What song would you like to query?",
		})
		.then((answer) => {
			connection.query(
				"SELECT * FROM top5000 WHERE ?",
				{ song: answer.song },
				function (err, res) {
					if (err) throw err;
					console.log(
						"Position: " +
							res[0].position +
							" || Song: " +
							res[0].song +
							" || Artist: " +
							res[0].artist +
							" || Year: " +
							res[0].year
					);
				}
			);
			promptOptions();
		});
};

//  A query which searches for a specific song in the top 5000 and returns the data for it
