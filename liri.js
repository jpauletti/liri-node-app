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
        }

        if (response.data.length === 0) {
            console.log("There are no upcoming events for that artist or band.");
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






















// 9. Make it so liri.js can take in one of the following commands:

// * `concert-this`

// * `spotify-this-song`

// * `movie-this`

// * `do-what-it-says`

// ### What Each Command Should Do

// 1. `node liri.js concert-this <artist/band name here>`

// * This will search the Bands in Town Artist Events API (`"https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"`) for an artist and render the following information about each event to the terminal:

//     * Name of the venue

//     * Venue location

//     * Date of the Event (use moment to format this as "MM/DD/YYYY")

// 2. `node liri.js spotify-this-song '<song name here>'`

// * This will show the following information about the song in your terminal/bash window

//     * Artist(s)

//     * The song's name

//     * A preview link of the song from Spotify

//     * The album that the song is from

// * If no song is provided then your program will default to "The Sign" by Ace of Base.

// * You will utilize the [node-spotify-api](https://www.npmjs.com/package/node-spotify-api) package in order to retrieve song information from the Spotify API.

// * The Spotify API requires you sign up as a developer to generate the necessary credentials. You can follow these steps in order to generate a **client id** and **client secret**:

// * Step One: Visit <https://developer.spotify.com/my-applications/#!/>

// * Step Two: Either login to your existing Spotify account or create a new one (a free account is fine) and log in.

// * Step Three: Once logged in, navigate to <https://developer.spotify.com/my-applications/#!/applications/create> to register a new application to be used with the Spotify API. You can fill in whatever you'd like for these fields. When finished, click the "complete" button.

// * Step Four: On the next screen, scroll down to where you see your client id and client secret. Copy these values down somewhere, you'll need them to use the Spotify API and the [node-spotify-api package](https://www.npmjs.com/package/node-spotify-api).

// 3. `node liri.js movie-this '<movie name here>'`

// * This will output the following information to your terminal/bash window:

//     ```
//     * Title of the movie.
//     * Year the movie came out.
//     * IMDB Rating of the movie.
//     * Rotten Tomatoes Rating of the movie.
//     * Country where the movie was produced.
//     * Language of the movie.
//     * Plot of the movie.
//     * Actors in the movie.
//     ```

// * If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'

//     * If you haven't watched "Mr. Nobody," then you should: <http://www.imdb.com/title/tt0485947/>

//     * It's on Netflix!

// * You'll use the `axios` package to retrieve data from the OMDB API. Like all of the in-class activities, the OMDB API requires an API key. You may use `trilogy`.

// 4. `node liri.js do-what-it-says`

// * Using the `fs` Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.

//     * It should run `spotify-this-song` for "I Want it That Way," as follows the text in `random.txt`.

//     * Edit the text in random.txt to test out the feature for movie-this and concert-this.
