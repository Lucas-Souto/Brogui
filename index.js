const Database = require('./db/Database');

exports.init = (connectData) =>
{
    const db = new Database();
    Database.connectData = connectData;

    db.initializeTables();
}

exports.users = require('./db/users');