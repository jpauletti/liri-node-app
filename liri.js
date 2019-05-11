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

        // show artist name
        console.log("===============================================================================");
        console.log(artistName);
        console.log("===============================================================================");

        // loop through results to display each
        for (var i = 0; i < response.data.length; i++) {
            
            // use moment.js to change date format
            var date = moment(response.data[i].datetime).format("MM/DD/YYYY");
            // use moment.js to format time
            var time = moment(response.data[i].datetime).format("hh:mm A");

            // if other country, list country instead of state
            if (response.data[i].venue.region === "") {
                var state = response.data[i].venue.country;
            } else {
                var state = response.data[i].venue.region;
            }

            // info to save and print
            var toLog = [
                response.data[i].venue.name,
                response.data[i].venue.city + ", " + state,
                date,
                time
            ].join("\n");

            // log the data to the txt file and console
            fs.appendFile("log.txt", toLog + "\n\n", function(err) {

                // log errors if any
                if (err) {
                    console.log(err);
                } else {
                    // if no error, log to console
                    console.log("\n" + toLog + "\n\n");
                }

            });

        }

        // if no results
        if (response.data.length === 0) {
            var noResults = "There are no upcoming events for that artist or band.";
            console.log(noResults);

            // if no results, log this
            fs.appendFile("log.txt", noResults + "\n\n", function (err) {
                if (err) {
                    console.log(err);
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

    // spotify api module
    spotify.search({ type: 'track', query: songName }, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        // info to save and print
        var toLog = [
            "Song Name: " + data.tracks.items[0].name,
            "Artist: " + data.tracks.items[0].artists[0].name,
            "Album: " + data.tracks.items[0].album.name,
            "Preview: " + data.tracks.items[0].album.external_urls.spotify
        ].join("\n");

        // log the data to the txt file and console
        fs.appendFile("log.txt", toLog + "\n\n", function (err) {
            // log errors if any
            if (err) {
                console.log(err);
            } else {
                // if no error, log to console
                console.log(toLog);
            }

        });
    });
}




// movie-this: OMDB API
function getMovie (movieName) {

    var queryUrl = "http://www.omdbapi.com/?apikey=trilogy&t=" + movieName;

    // OMDB API call
    axios.get(queryUrl)
    .then(function (response) {

        // info to save and print
        var toLog = [
            "Title: " + response.data.Title + " (" + response.data.Year + ")",
            "Actors: " + response.data.Actors,
            "Plot: " + response.data.Plot,
            "Language: " + response.data.Language,
            "Country Produced: " + response.data.Country,
            "IMDb rating: " + response.data.imdbRating,
            "Rotten Tomatoes rating: " + response.data.Ratings[1].Value
        ].join("\n\n");

        // log info to log.txt and to console
        fs.appendFile("log.txt", toLog + "\n\n", function (err) {
            // log errors if any
            if (err) {
                console.log(err);
            } else {
                // if no errors, log to console
                console.log(toLog);
            }
        });
    })
    .catch(function (error) {
        console.log(error);
    });

}




// do-what-it-says
function getRandom () {

    // read file to get random command / search
    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) {
            return console.log(err);
        }

        // separate the command from the song name
        var commandInfo = data.split(",");

        // save command as variable
        var command = commandInfo[0];

        // log the command and search that's in the random.txt file
        fs.appendFile("log.txt", command + ": " + commandInfo[1] + "\n\n", function (err) {
            // log errors if any
            if (err) {
                console.log(err);
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

// for each new search, we'll add space and a divider
var newEntry = "\n\n\n" + "=====================================================================================================================" + "\n";

// save the command and search
var searchMade = newEntry + command + ": " + process.argv.slice(3).join(" ") + "\n\n";

if (command) {
    // log the command and search to log.txt
    fs.appendFile("log.txt", searchMade, function (err) {
        if (err) {
            console.log(err);
        }

    });
}


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

    default:
        console.log("Please enter a valid command.");
        console.log('(Try: "concert-this", "spotify-this-song", "movie-this", or "do-what-it-says")');
}