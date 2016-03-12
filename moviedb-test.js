var theMovieDb = require('./themoviedb').movieDb;

theMovieDb.common.api_key = "701f754249ddd9a80e38f464539ffe05";

function successCB(data) {
    console.log("Success callback: " + data);
};

function errorCB(data) {
    console.log("Error callback: " + data);
};


theMovieDb.genres.getList({}, successCB, errorCB);