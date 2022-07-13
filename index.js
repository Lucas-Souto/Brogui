const db = require('./db/Database');

exports.Database = db;

exports.init = (connectData) =>
{
    db.connectData = connectData;

    db.initializeTables();
}

exports.users = require('./db/users');
exports.posts = require('./db/posts');
exports.comments = require('./db/comments');