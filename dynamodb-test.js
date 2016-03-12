var ddb = require('./node_modules/dynamodb/index.js').ddb({
    accessKeyId: '',
    secretAccessKey: ''
});

//ddb.listTables({}, function(err, res) {
//    console.log("err: " + err);
//    console.log("res: " + JSON.stringify(res));
//});

var item = {
    EchoId: "echo-id", // primary key
    last_updated: (new Date).getTime(),
    last_movie: "Deadpool"
};

/**
 * PUT
 *
 * Sample result:
 * put err: null
 * put res: undefined
 * put cap: 1
 */
//ddb.putItem('thecritic', item, {}, function(err, res, cap) {
//    console.log("put err: " + JSON.stringify(err));
//    console.log("put res: " + JSON.stringify(res));
//    console.log("put cap: " + JSON.stringify(cap));
//});


/**
 * GET
 *
 * Sample result nothing in the db:
 * get err: null
 * get res: undefined
 * get cap: 0.5
 *
 * With something:
 * get err: null
 * get res: {"last_updated":1457807850981,"EchoId":"echo-id","last_movie":"Deadpool"}
 * get cap: 0.5
 */
//ddb.getItem('thecritic', 'echo-id', null, {}, function(err, res, cap) {
//    console.log("get err: " + JSON.stringify(err));
//    console.log("get res: " + JSON.stringify(res));
//    console.log("get cap: " + JSON.stringify(cap));
//});


