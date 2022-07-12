const dateToMysql = require('./dateToMysql');
const Database = require('./Database');
const db = new Database();
const defaultCallback = (error, results, fields) => {};

exports.insert = (author, content, postId, mainId = null, callback = defaultCallback) =>
{
    db.run('INSERT INTO comments (id, author, content, date, postId, mainId) VALUES (uuid(), ?, ?, ?, ?, ?)', [author, content, dateToMysql(), postId, mainId], callback);
}

exports.list = (postId, mainId = null, minDate = 0, limit = 16, callback = defaultCallback) =>
{
    db.run(`SELECT * FROM comments WHERE date > ? AND postId = ? AND (mainId = ? OR mainId IS NULL) ORDER BY date LIMIT ?`, [minDate, postId, mainId, limit], callback);
}

exports.delete = (id, callback = defaultCallback) =>
{
    db.run(`DELETE FROM comments WHERE id = ? OR mainId = ?`, [id, id], callback);
}