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

    var intent = intentRequest.intent,
        intentName = intentRequest.intent.name;

    // Dispatch to your skill's intent handlers
    if ("AddReleaseYearIntent" === intentName) {
        addReleaseYear(intent, session, callback);
    } else if ("RecommendMovieIntent" === intentName) {
        recommendMovie(intent, session, callback);
    } else if ("ListGenresIntent" === intentName) {
        listGenres(callback);
    } else if ("LaunchIntent" === intentName){
        welcome(callback);
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

function welcome(welcome_callback) {

    //TODO: Query for random current top movie
    //if user liked last movie, ask them about it

    var async = require('async');

     async.waterfall([
        randomIdFunc,
        getMovie,
        complete
     ], function(err, result) {

     });

     function randomIdFunc(callback) {
        callback(null,getRandomGenreID());
     }

     function getMovie(movieId, callback) {
        console.log("genre id is "+ movieId);
        var movie = getTopRatedMovie(movieId, function (movie){
        callback(null, movie);
        });
     }

     function complete(movie, callback) {
        var parsedMovie = JSON.parse(movie);
         speechOutput = "Welcome, the top movie in theatres is now " + JSON.stringify(parsedMovie.title);
 welcome_callback({},
         buildSpeechletResponse("welcome", speechOutput, "", false));     }
}

function addReleaseYear(intent, session, callback) {
    var releaseYearSlot = intent.slots.RELEASEYEAR;
    var releaseYear = releaseYearSlot.value.replace(',','');

    var speechOutput = "addReleaseYear is " + releaseYear;
    var sessionAttributes = {};


    callback(sessionAttributes,
     buildSpeechletResponse("addReleaseYear", speechOutput, "", false));
}

function recommendMovie(intent, session, callback) {
    var genreSlot = intent.slots.GENRE;
    var genre = genreSlot.value;
    var speechOutput = "recommendMovie is " + genre
    var sessionAttributes = {};

    var genre_id = getGenreID(genre);
    if (genre_id > -1) {
        speechOutput = "The genre id is " + genre_id;
        callback(sessionAttributes,
            buildSpeechletResponse("recommendMovie", speechOutput, "", false));
    }
    else {
        speechOutput = "Sorry, I don't know the genre(s) you're interested in";
        callback(sessionAttributes,
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

    var movie = Math.round(Math.random()) ? getRandomGenreMovie() : getRandomYearMovie();
    var speechOutput = generateRecommendationSpeech(movie);
    var sessionAttributes = {};

    callback(sessionAttributes,
         buildSpeechletResponse("CommandNegativeMovieIntent", speechOutput, "", true)); 
}

function handlePositiveMovieIntent(intent, session, callback) {
    //record movie in user preferences
    var movie = "Deadpool";
    var speechOutput = "Great, you can watch " + movie + " in theatres. Next time, let me know if it’s great.";
    var sessionAttributes = {};

    callback(sessionAttributes,
         buildSpeechletResponse("CommandPositiveMovieIntent", speechOutput, "", true));    
}

function getRandomGenreMovie() {
    // randomly retrieve top movie amongst a random genre
    return "Interstellar"
}

function getRandomYearMovie() {
    // randomly retrieve top movie amongst a random genre
    return "Casablanca";
}

function generateRecommendationSpeech(movie) {
    return "Would you be interested in watching "+ movie;
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

  function getTopRatedMovie(genre_id, callback) {
    var theMovieDb = require('./themoviedb').movieDb;
    theMovieDb.common.api_key = "701f754249ddd9a80e38f464539ffe05";
    theMovieDb.common.base_uri = "https://api.themoviedb.org/3/";

    console.log("the genreid is " + genre_id);

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