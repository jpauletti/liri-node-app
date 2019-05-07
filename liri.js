// module requirements
require("dotenv").config();
var axios = require("axios");
var Spotify = require("node-spotify-api");
var moment = require("moment");
var fs = require("fs");

// import spotify keys
var keys = require("./keys.js");

// access spotify key info
var spotify = new Spotify(keys.spotify);


// concert-this: bands in town API to get concerts
function getConcerts (artistName) {

    var queryUrl = "https://rest.bandsintown.com/artists/" + artistName + "/events?app_id=codingbootcamp";

    axios.get(queryUrl)
    .then(function (response) {
        // limit to 10 results
        if (response.data.length > 10) {
            response.data.length = 10;
        }
        // console.log(response.data);

        // show artist name
        console.log("===============================================================================");
        console.log(artistName);
        console.log("===============================================================================");

        // loop through results to display each
        for (var i = 0; i < response.data.length; i++) {
            // name of venue
            console.log(response.data[i].venue.name);
            // city and state
            console.log(response.data[i].venue.city + ", " + response.data[i].venue.region);
            // use moment.js to change date format
            var date = moment(response.data[i].datetime).format("MM/DD/YYYY");
            console.log(date);
            // use moment.js to format time
            console.log(moment(response.data[i].datetime).format("hh:mm A"));

            // add space after entry, if not the last one
            if (i !== (response.data.length -1)) {
                console.log("\n");
            }

            var toLog = {
                venue: response.data[i].venue.name,
                location: response.data[i].venue.city + ", " + response.data[i].venue.region,
                date: date,
                time: moment(response.data[i].datetime).format("hh:mm A")
            };

            // also log the data to the txt file
            fs.appendFileSync("log.txt", JSON.stringify(toLog, null, 2) + "\n\n", function(err) {

                // If an error was experienced we will log it.
                if (err) {
                console.log(err);
                } else {  // if no error is experienced
                console.log("Search saved to log.txt.");
                }

            });

        }

        if (response.data.length === 0) {
            console.log("There are no upcoming events for that artist or band.");

            // if no results, log this
            fs.appendFileSync("log.txt", "There are no upcoming events for that artist or band." + "\n\n", function (err) {

                // If an error was experienced we will log it.
                if (err) {
                    console.log(err);
                } else {  // if no error is experienced
                    console.log("Search saved to log.txt.");
                }

            });
        }


    })
    .catch(function (error) {
        console.log(error);
    });

}




// spotify-this-song: spotify api
function getSongInfo (songName) {

    spotify.search({ type: 'track', query: songName }, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        console.log("Song Name: " + data.tracks.items[0].name);
        console.log("Artist: " + data.tracks.items[0].artists[0].name);
        console.log("Album: " + data.tracks.items[0].album.name);
        console.log("Preview: " + data.tracks.items[0].album.external_urls.spotify); // preview link to the song on spotify

        var toLog = {
            songName: data.tracks.items[0].name,
            artist: data.tracks.items[0].artists[0].name,
            album: data.tracks.items[0].album.name,
            previewLink: data.tracks.items[0].album.external_urls.spotify
        };

        // also log the data to the txt file
        fs.appendFileSync("log.txt", JSON.stringify(toLog, null, 2) + "\n\n", function (err) {

            // If an error was experienced we will log it.
            if (err) {
                console.log(err);
            } else {  // if no error is experienced
                console.log("Search saved to log.txt.");
            }

        });
    });
}




// movie-this: OMDB API
function getMovie (movieName) {

    var queryUrl = "http://www.omdbapi.com/?apikey=trilogy&t=" + movieName;

    axios.get(queryUrl)
    .then(function (response) {
        console.log(response.data.Title + " (" + response.data.Year +")");
        console.log("Actors: " + response.data.Actors);
        console.log("Plot: " + response.data.Plot);
        console.log("Language: " + response.data.Language);
        console.log("Country Produced: " + response.data.Country);
        console.log("IMDb rating: " + response.data.imdbRating);
        console.log("Rotten Tomatoes rating: " + response.data.Ratings[1].Value);

        var toLog = {
            title: response.data.Title,
            year: response.data.Year,
            actors: response.data.Actors,
            plot: response.data.Plot,
            language: response.data.Language,
            countryProduced: response.data.Country,
            imdbRating: response.data.imdbRating,
            rottenTomatoesRating: response.data.Ratings[1].Value
        };

        // also log the data to the txt file
        fs.appendFileSync("log.txt", JSON.stringify(toLog, null, 2) + "\n\n", function (err) {

            // If an error was experienced we will log it.
            if (err) {
                console.log(err);
            } else {  // if no error is experienced
                console.log("Search saved to log.txt.");
            }

        });

    })
    .catch(function (error) {
        console.log(error);
    });

}




// do-what-it-says
function getRandom () {

    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) {
            return console.log(err);
        }

        // separate the command from the song name
        var commandInfo = data.split(",");

        // save command and songName variables
        var command = commandInfo[0];

        // log the command and search that's in the random.txt file
        fs.appendFileSync("log.txt", command + ": " + commandInfo[1] + "\n\n", function (err) {
            // If an error was experienced we will log it.
            if (err) {
                console.log(err);
            } else {  // if no error is experienced
                console.log("Search saved to log.txt.");
            }
        });

        // instructions to follow for each command
        switch (command) {
            case "concert-this":

                // save artist name from file
                // remove quotes around the name
                var artistName = commandInfo[1].slice(1,-1);

                getConcerts(artistName);
                break;

            case "spotify-this-song":
                // save song name from file
                var songName = commandInfo[1];

                getSongInfo(songName);
                break;

            case "movie-this":

                // save movie name from file
                var movieName = commandInfo[1];

                getMovie(movieName);
                break;
        }

        
        
    })
}









// save command entered
var command = process.argv[2];

var newEntry = "\n\n\n" + "=====================================================================================================================" + "\n";

// log command and search to a txt file
fs.appendFileSync("log.txt", newEntry + command + ": " + process.argv.slice(3).join(" ") + "\n\n", function (err) {
    // If an error was experienced we will log it.
    if (err) {
        console.log(err);
    } else {  // if no error is experienced
        console.log("Search saved to log.txt.");
    }
});


// instructions to follow for each command
switch (command) {
    case "concert-this":
        // pull artist name entered
        var artistName = process.argv.slice(3).join(" ");

        // if no song name was given, provide default
        if (artistName === "") {
            // default to "The Sign" by Ace of Base
            artistName = "Julia Michaels";
            console.log("You didn't enter an artist or band.  Here's one we like.");
        }

        getConcerts(artistName);
        break;

    case "spotify-this-song":
        // pull song name user entered
        var songName = process.argv.slice(3).join(" ");
        // console.log("songName: " + songName);

        // if no song name was given, provide default
        if (songName === "") {
            // default to "The Sign" by Ace of Base
            songName = "The Sign Ace of Base";
            console.log("You didn't enter a song.  Here's one we like.");
        }

        getSongInfo(songName);
        break;

    case "movie-this":
        // pull movie name user entered
        var movieName = process.argv.slice(3).join(" ");

        // if no movie name was given, provide default
        if (movieName === "") {
            // default to Mr. Nobody
            movieName = "Mr. Nobody";
            console.log("You didn't enter a movie name.  Here's one we like.");
        }

        getMovie(movieName);
        break;

    case "do-what-it-says":
        getRandom();
        break;
}

