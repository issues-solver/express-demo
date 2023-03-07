const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const getMongoDbUrl = (
    userName = 'sergejprovalinskij',
    password = 'qwerty597',
    databaseName = 'nodejs-shop'
) => `mongodb+srv://${userName}:${password}@cluster0.omwdai9.mongodb.net/${databaseName}?retryWrites=true&w=majority`;

const mongoConnect = (cb) => {
    MongoClient
        .connect(getMongoDbUrl())
        .then((client) => {
            _db = client.db();
            cb(client);
        })
        .catch((err) => console.log(err));
};

const getDb = () => {
    if (_db) {
        return _db;
    }
    throw 'No database found';
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
