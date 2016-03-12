var ddb = require('./node_modules/dynamodb/index.js').ddb({
    accessKeyId: '',
    secretAccessKey: ''
});

ddb.listTables({}, function(err, res) {
    console.log("err: " + err);
    console.log("res: " + JSON.stringify(res));
});
