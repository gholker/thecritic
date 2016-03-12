var theMovieDb = require('./themoviedb').movieDb;

theMovieDb.common.api_key = "701f754249ddd9a80e38f464539ffe05";
theMovieDb.common.base_uri = "https://api.themoviedb.org/3/";

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
        'page':1,
        'with_genres': '35,28|35|28', // (comedy and action) or comedy or action
        //'release_date.gte': '2015-01-31',
        //'release_date.lte': '2016-01-31',
        'primary_release_year' : '1994',
        'sort_by': 'popularity.desc',  // also 'release_date.desc', 'vote_average.desc'
        'vote_count.gte': 5 //
    }, successCB, errorCB);
} else if (argument === 'movie') {
    theMovieDb.movies.getById({"id": 293660}, successCB, errorCB);
} else if (argument === 'credits') {
    theMovieDb.movies.getCredits({"id": 293660}, successCB, errorCB);
} else if (argument === 'similar') {
    theMovieDb.movies.getSimilarMovies({"id": 293660}, successCB, errorCB);
} else {
    console.log("invalid argument: " + argument);
}


