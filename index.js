const db = require('./db/Database');

exports.Database = db;

exports.init = (connectData, then = () => {}) =>
{
    db.connectData = connectData;

    db.initializeTables(then);
}

exports.users = require('./db/users');
exports.posts = require('./db/posts');
exports.comments = require('./db/comments');