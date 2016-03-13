/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills Kit.
 * The Intent Schema, Custom Slots, and Sample Utterances for this skill, as well as
 * testing instructions are located at http://amzn.to/1LzFrj6
 *
 * For additional samples, visit the Alexa Skills Kit Getting Started guide at
 * http://amzn.to/1LGWsLG
 */

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.

exports.handler = function (event, context) {
    try {
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);

        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */
        /*
        if (event.session.application.applicationId !== "amzn1.echo-sdk-ams.app.[unique-value-here]") {
             context.fail("Invalid Application ID");
        }
        */

        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }

        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "IntentRequest") {
            onIntent(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, event.session);
            context.succeed();
        }
    } catch (e) {
        context.fail("Exception: " + e);
    }
};

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log("onSessionStarted requestId=" + sessionStartedRequest.requestId +
        ", sessionId=" + session.sessionId);
    if(!session.attributes) {
        session.attributes = {};
    }
}

/**
 * Called when the user launches the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log("onLaunch requestId=" + launchRequest.requestId +
        ", sessionId=" + session.sessionId);

    welcome(callback);
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    console.log("onIntent requestId=" + intentRequest.requestId +
        ", sessionId=" + session.sessionId);
    if (session.attributes) {
        console.log("session release year: " + session.attributes.releaseYear);
    }

    var intent = intentRequest.intent,
        intentName = intentRequest.intent.name;

    // Dispatch to your skill's intent handlers
    if ("AddReleaseYearIntent" === intentName) {
        addReleaseYear(intent, session, callback);
    } else if ("RecommendMovieIntent" === intentName) {
        addGenre(intent, session, callback);
    } else if ("ListGenresIntent" === intentName) {
        listGenres(callback);
    } else if ("LaunchIntent" === intentName){
        welcome(session, callback);
    } else if ("CommandNegativeMovieIntent" === intentName){
        handleNegativeMovieIntent(intent, session, callback);
    } else if ("CommandPositiveMovieIntent" === intentName){
        handlePositiveMovieIntent(intent, session, callback);
    } 
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId +
        ", sessionId=" + session.sessionId);
    // Add cleanup logic here
}

// --------------- Functions that control the skill's behavior -----------------------

function welcome(session, welcome_callback) {
    async_new_user_flow(session, welcome_callback);
}

function async_new_user_flow(session, async_callback) {
        var async = require('async');

     async.waterfall([
        getMovie,
        complete
     ], function(err, result) {

     });

     function getMovie(callback) {
        var movie = getRandomGenreMovie(function (movie){
        callback(null, movie);
        });
     }

    function complete(movie, callback) {
        var parsedMovie = JSON.parse(movie);
        session.attributes.lastSuggestedMovieId = parsedMovie.id;
        speechOutput = "Welcome to the critic! A top rated movie you can now watch is " + JSON.stringify(parsedMovie.title);
        async_callback(session.attributes, buildSpeechletResponse("welcome", speechOutput, "", false));
    }
}

function addReleaseYear(intent, session, callback) {
    // if the add release year then presumably they didn't like the last movie suggestion
    addLastMovieToNegated(session);

    var releaseYearSlot = intent.slots.RELEASEYEAR;
    var releaseYear = releaseYearSlot.value.replace(',','');

    var speechOutput = "ok " + releaseYear;
    session.attributes.releaseYear = releaseYear;

    getNextMovieSuggestion(session, function(movie){
        session.attributes.lastSuggestedMovieId = movie.id;
        speechOutput += ". How about " + JSON.stringify(movie.title) + "?";
        callback(session.attributes, buildSpeechletResponse("addReleaseYear", speechOutput, "", false));
    });

}

function addGenre(intent, session, callback) {
    // if the add genre then presumably they didn't like the last movie suggestion
    addLastMovieToNegated(session);

    var genreSlot = intent.slots.GENRE;
    var genre = genreSlot.value;

    var genre_id = getGenreID(genre);
    if (genre_id > -1) {
        if (!session.attributes.genres) {
            session.attributes.genres = [];
        }
        session.attributes.genres.push(genre_id);
        getNextMovieSuggestion(session, function(movie){
            session.attributes.lastSuggestedMovieId = movie.id;
            var speechOutput = "Ok. How about " + JSON.stringify(movie.title) + "?";
            callback(session.attributes, buildSpeechletResponse("recommendMovie", speechOutput, "", false));
        });
    }
    else {
        speechOutput = "Sorry, I didn't catch that";
        callback(session.attributes,
            buildSpeechletResponse("recommendMovie", speechOutput, "", false));
    }
}

function listGenres(callback) {

    var speechOutput = "The genres you can ask me about are the following: Action,Adventure,Animation,Comedy,Crime,Documentary,Drama,Family,Fantasy,Foreign,History,Horror,Music,Mystery,Romance,Science Fiction,TV Movie,Thriller,War,Western";
    var sessionAttributes = {};

    callback(sessionAttributes,
         buildSpeechletResponse("ListGenres", speechOutput, "", false));

}

function handleNegativeMovieIntent(intent, session, callback) {
    //record movie in user preferences
    // if new user recommend random movie
    // else, recommend based on favourites
    addLastMovieToNegated(session);

    if (false) {
        async_random_movie_flow(session, callback);
    } else {
        getNextMovieSuggestion(session, function(movie){
            session.attributes.lastSuggestedMovieId = movie.id;
            var speechOutput = "Ok. How about " + JSON.stringify(movie.title) + "?";
            callback(session.attributes, buildSpeechletResponse("negativeResponse", speechOutput, "", false));
        });
    }
}

function addLastMovieToNegated(session) {
    if (session.attributes.lastSuggestedMovieId) {
        if (!session.attributes.negatedMovies) {
            session.attributes.negatedMovies = [];
        }
        session.attributes.negatedMovies.push(session.attributes.lastSuggestedMovieId);
        session.attributes.lastSuggestedMovieId = null;
    }
}

function async_random_movie_flow(session, async_callback) {
        var async = require('async');

     async.waterfall([
        getMovie,
        complete
     ], function(err, result) {

     });

     function getMovie(callback) {
        var res = Math.random() * (1);
        if (res) {
            console.log("random genre");
            var movie = getRandomGenreMovie(function (movie){
                callback(null, movie);
            });
        } else {
            console.log("random year");
            var movie = getRandomYearMovie(function (movie){
                callback(null, movie);
            });
        }
     }

    function complete(movie, callback) {
        speechOutput = generateRecommendationSpeech(movie);
        session.attributes.lastSuggestedMovieId = JSON.parse(movie).id;
        async_callback(session.attributes, buildSpeechletResponse("async_random_movie_flow", speechOutput, "", false));
    }
}

function handlePositiveMovieIntent(intent, session, callback) {
    //record movie in user preferences
    var movie = "Deadpool";
    var speechOutput = "Great, you can watch " + movie + " in theatres. Next time, let me know if it’s great.";
    var sessionAttributes = {};

    callback(sessionAttributes,
         buildSpeechletResponse("CommandPositiveMovieIntent", speechOutput, "", true));    
}

function getRandomGenreMovie(callback) {
    // randomly retrieve top movie amongst a random genre
    var randomGenreID = getRandomGenreID();
    getTopRatedMovie(randomGenreID, callback);
}

function getRandomYearMovie(callback) {
    // randomly retrieve top movie amongst a random genre
    var randomYear = getRandomYear();
    getTopRatedMovieForYear(randomYear, callback);
}

function generateRecommendationSpeech(movie) {
    var parsedMovie = JSON.parse(movie);
    var randomResponse = randomNumber(5,1);
    var response;
    switch(randomResponse)  {
        case 1:
            response  = "Would you be interested in watching "+ JSON.stringify(parsedMovie.title) + " instead?";
            break;
        case 2:
            response  = "What about "+ JSON.stringify(parsedMovie.title) + " ?";
            break;
        case 3:
            response  = "You might enjoy "+ JSON.stringify(parsedMovie.title) + " ?";
            break;
        case 4:
            response  = "I think you might like "+ JSON.stringify(parsedMovie.title);
            break;
        case 5:
            response  = "I think "+ JSON.stringify(parsedMovie.title) + " might peak your interest";
            break;
        default:
            response  = "Would you be interested in watching "+ JSON.stringify(parsedMovie.title) + " instead?";
    }

    return response;
}

//  Helpers for Lookup
 function getGenreID(genre_name) {
     var local_genres = require('./genres.json');
      var genre_id =  -1;
      for (var i in local_genres.genres) {
        var genreDictionary =  local_genres.genres[i];
        if (genreDictionary.name === genre_name) {
            genre_id = genreDictionary.id;
            break;
        }
      }
      return genre_id;
 }

 function getRandomGenreID() {
    var local_genres = require('./genres.json');
    var genre_id =  -1;
    var index = Math.floor(Math.random() * (local_genres.genres.length - 1 )) + 0
    var genreDictionary =  local_genres.genres[index];
    return genreDictionary.id;
 }

 function getRandomYear() {
    var years = require('./years.json');
    var year_id =  -1;
    var index = Math.floor(Math.random() * (years.years.length - 1 )) + 0
    var yearDictionary =  years.years[index];
    return yearDictionary.year;
 }

 //------ movie db requests

  function getTopRatedMovie(genre_id, callback) {
    var theMovieDb = require('./themoviedb').movieDb;
    theMovieDb.common.api_key = "701f754249ddd9a80e38f464539ffe05";
    theMovieDb.common.base_uri = "https://api.themoviedb.org/3/";

    function successCB(data) {
        console.log("SUCCESS RETRIEVING TOP RATED MOVIE");
        var parsed = JSON.parse(data);
        callback(JSON.stringify(parsed.results[0]));
    };


    function errorCB(data) {
        console.log("ERROR RETRIEVING TOP RATED MOVIE");
        console.log("Error callback: " + data);
        callback("");
    };

    theMovieDb.discover.getMovies({
        'page':1,
        'with_genres': genre_id,
        'release_date.gte': '2015-01-31',
        'sort_by': 'popularity.desc',
        'vote_count.gte': 5 //
    }, successCB, errorCB);
}

  function getTopRatedMovieForYear(year, callback) {
    var theMovieDb = require('./themoviedb').movieDb;
    theMovieDb.common.api_key = "701f754249ddd9a80e38f464539ffe05";
    theMovieDb.common.base_uri = "https://api.themoviedb.org/3/";

    function successCB(data) {
        console.log("SUCCESS RETRIEVING TOP RATED MOVIE FOR YEAR");
        var parsed = JSON.parse(data);
        callback(JSON.stringify(parsed.results[0]));
    };


    function errorCB(data) {
        console.log("ERROR RETRIEVING TOP RATED MOVIE FOR YEAR");
        console.log("Error callback: " + data);
        callback("");
    };

    theMovieDb.discover.getMovies({
        'page':1,
        'primary_release_year' : year,
        'sort_by': 'popularity.desc',
        'vote_count.gte': 5 //
    }, successCB, errorCB);
}

function getNextMovieSuggestion(session, callback) {
    var theMovieDb = require('./themoviedb').movieDb;
    theMovieDb.common.api_key = "701f754249ddd9a80e38f464539ffe05";
    theMovieDb.common.base_uri = "https://api.themoviedb.org/3/";

    function successCB(data) {

        var parsed = JSON.parse(data);
        var negatedMovies = session.attributes.negatedMovies;
        if (negatedMovies && negatedMovies.length > 0) {
            console.log("checking if movie is negated");
            for (var i in parsed.results) {
                //var result = JSON.stringify(parsed.results[i]);
                var result = parsed.results[i];
                console.log(result);

                var isNegated = false;
                for (var j in negatedMovies) {
                    var id = negatedMovies[j];
                    if (result.id === id) {
                        console.log("found movie was negated: " + id);
                        isNegated = true;
                        break;
                    }
                }

                if (!isNegated) {
                    console.log("found movie that has not been negated");
                    callback(result);
                    break;
                }
            }
        } else {
            console.log("return result disregard negated movies");
            console.log(parsed.results[0]);
            callback(parsed.results[0]);
        }

    }


    function errorCB(data) {
        console.log("ERROR RETRIEVING TOP RATED MOVIE FOR YEAR");
        console.log("Error callback: " + data);
        callback("");
    }

    var query = {
        'page':1,
        'sort_by': 'popularity.desc',
        'vote_count.gte': 5 //
    };
    if (session.attributes.releaseYear) {
        query['primary_release_year'] = session.attributes.releaseYear;
    } else {
        // default to within the last year
        var date = new Date();
        date.setFullYear(date.getFullYear() - 1);
        var month = (date.getMonth() + 1);
        var day = date.getDate();
        var dateformat = date.getFullYear() + '-' + (month > 9 ? month : "0" + month) + '-' + (day > 9 ? day : "0" + day);
        console.log("query with date: " + dateformat);
        query['release_date.gte'] = dateformat;
    }
    if (session.attributes.genres && session.attributes.genres.length > 0) {
        var s = "";
        for (var i in session.attributes.genres) {
            if (s.length > 0) {
                s += "|";
            }
            s += session.attributes.genres[i];
        }
        query['with_genres'] = s;
    }
    theMovieDb.discover.getMovies(query, successCB, errorCB);
}

function randomNumber(max, min) {
    return Math.floor(Math.random() * (max - min )) + min;
}

// --------------- Helpers that build all of the responses -----------------------

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        card: {
            type: "Simple",
            title: "SessionSpeechlet - " + title,
            content: "SessionSpeechlet - " + output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
}