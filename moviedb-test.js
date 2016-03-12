var theMovieDb = require('./themoviedb').movieDb;

theMovieDb.common.api_key = "701f754249ddd9a80e38f464539ffe05";

var argument = process.argv[2];

function successCB(data) {
    console.log("Success callback for " +argument+ ": " + data);
};

function errorCB(data) {
    console.log("Error callback: " + data);
};


if (argument === 'genre') {
    theMovieDb.genres.getList({}, successCB, errorCB);
} else if (argument === 'discover') {
    // http://docs.themoviedb.apiary.io/#reference/discover/discovermovie
    theMovieDb.discover.getMovies({
        'include_adult': true,
        'with_genres': '35,28|35|28' // (comedy and action) or comedy or action
    }, successCB, errorCB);
} else if (argument === 'movie') {
    theMovieDb.movies.getById({"id":293660 }, successCB, errorCB)
} else {
    console.log("invalid argument: " + argument);
}


