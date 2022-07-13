const Database = require('./db/Database');

exports.Database = Database;

exports.init = (connectData) =>
{
    const db = new Database();
    Database.connectData = connectData;

    db.initializeTables();
}

exports.users = require('./db/users');
exports.posts = require('./db/posts');
exports.comments = require('./db/comments');