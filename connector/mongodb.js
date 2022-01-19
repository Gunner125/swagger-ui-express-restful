const { MongoClient } = require("mongodb");
const mongUrl = 'mongodb+srv://pae:YHBXsEYqb6HnzQBN@cluster0.wvwnh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

module.exports.mongo = function (callback) {
    MongoClient.connect(mongUrl, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, dbs) {
        if (err) {
            console.error('Err ' + err.message);
            callback(false);
        } else {
            module.exports.api = dbs.db("PointStore");
            callback(true);
        }
    });
};