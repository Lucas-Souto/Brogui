const dateToMysql = require('./dateToMysql');
const Database = require('./Database');
const db = new Database();
const defaultCallback = (error, results, fields) => {};

exports.insert = (author, content, postId = null, mainComment = null, callback = defaultCallback) =>
{
    if (postId != null && mainComment == null) db.run('INSERT INTO comments (id, author, content, date, postId) VALUES (uuid(), ?, ?, ?, ?)', [author, content, dateToMysql(), postId], callback);
    else if (mainComment != null) db.run('INSERT INTO subcomments (id, author, content, date, mainId) VALUES (uuid(), ?, ?, ?, ?)', [author, content, dateToMysql(), mainComment], callback);
}

exports.list = (postId, callback = defaultCallback) =>
{
    db.run(`SELECT comment.*, 
        CONCAT("[", GROUP_CONCAT(CONCAT('{"id":"', sub.id, '","author":"', sub.author, '","content":"', sub.content, '"}')), "]") as subcomments
        FROM comments comment
        LEFT JOIN subcomments sub ON (sub.mainId = comment.id)
        WHERE postId = ?`, 
    [postId], callback);
}

exports.delete = (id, isMain = true, callback = defaultCallback) =>
{
    db.run(`DELETE FROM ${ isMain ? 'comments' : 'subcomments' } WHERE id = ?`, [id], callback);
}