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
    theMovieDb.discover.getMovies({}, successCB, errorCB)
} else {
    console.log("invalid argument: " + argument);
}


