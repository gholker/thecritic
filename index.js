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
    } else {
        throw "Invalid intent";
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

//  Helpers for Lookup
 function getGenreID(genre_name) {
     var local_genres = require('./genres.json');
      console.log(local_genres);
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