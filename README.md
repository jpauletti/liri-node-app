# liri-node-app

This is a Node.js application that takes in user inputs and performs searches based on the input.



Valid Searches  | Actions Taken
------------- | -------------
concert-this Julia Michaels  | Searches the bandsintown API to find 10 upcoming concerts for the artist entered (Julia Michaels).
spotify-this-song What A Time  | Searches the Spotify API for the song entered (What A Time) and returns the song title, artist, album, and a link to it on Spotify.
movie-this Harry Potter  | Searches the OMDB API for the movie entered (Harry Potter) and returns the movie title, year, actors, plot, language, country produced, and its ratings on IMDb and Rotten Tomatos.
do-what-it-says  | Performs a search based on content in a text file.


If no search term is provided, an example will be used while informing the user that they did not enter a search term.