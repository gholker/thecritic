
 function getRandomGenreID() {
    var local_genres = require('./genres.json');
    console.log(local_genres);
    var genre_id =  -1;
    var index = Math.floor(Math.random() * (local_genres.genres.length - 1 )) + 0
    var genreDictionary =  local_genres.genres[index];
    console.log(genreDictionary.id);
    return genreDictionary.id;;
 }

 function getTopRatedMovie(genre_id) {
    var theMovieDb = require('./themoviedb').movieDb;
    theMovieDb.common.api_key = "701f754249ddd9a80e38f464539ffe05";
    theMovieDb.common.base_uri = "https://api.themoviedb.org/3/";
    function successCB(data) {
    	var parsed = JSON.parse(data);
    	console.log(JSON.stringify(parsed.results[0]));
        return(JSON.stringify(parsed.results[0]));
    };


    function errorCB(data) {
        console.log("Error callback: " + data);
        return("");
    };

    theMovieDb.discover.getMovies({
        'page':1,
        'with_genres': genre_id,
        'release_date.gte': '2015-01-31',
        'sort_by': 'popularity.desc',
        'vote_count.gte': 5 //
    }, successCB, errorCB);
}

 function getRandomYear() {
    var years = require('./years.json');
    var year_id =  -1;
    var index = Math.floor(Math.random() * (years.years.length - 1 )) + 0
    var yearDictionary =  years.years[index];
    return yearDictionary.year;
 }

  function retrieveMovie(movieId, callback) {
   var theMovieDb = require('./themoviedb').movieDb;
    theMovieDb.common.api_key = "701f754249ddd9a80e38f464539ffe05";
    theMovieDb.common.base_uri = "https://api.themoviedb.org/3/";

    function successCB(data) {
        var parsed = JSON.parse(data);
        return JSON.stringify(parsed);
        // callback(JSON.stringify(parsed));
    };


    function errorCB(data) {
        console.log("ERROR RETRIEVING MOVIE");
        console.log("Error callback: " + data);
        // callback("");
    };

    theMovieDb.movies.getById({
        'id':movieId
    }, successCB, errorCB);
 }

 var id = retrieveMovie(256835, null);
 console.log(id);