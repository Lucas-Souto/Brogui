const Database = require('./Database');
const db = new Database();
const defaultCallback = (error, results, fields) => {};

function titleToLink(title)
{
    return title.replace(/ /g, "_").normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9_]+/g, "").toLowerCase();
}

function dateToMysql()
{
    return new Date().toISOString().slice(0, 19).replace('T', ' ');
}

function getContains(author, link, callback = defaultCallback)
{
    db.run('SELECT * FROM posts WHERE author = ? AND link LIKE ?', [author, link + "%"], callback);
}

exports.insert = (author, title, content, cover = null, isDraft = true, callback = defaultCallback) =>
{
    const link = titleToLink(title);

    getContains(author, link, (error, rows) =>
    {
        const concat = rows.length != 0 ? rows.length : '';

        db.run('INSERT INTO posts (id, link, author, title, content, cover, date, isDraft) VALUES(uuid(), CONCAT(?, ?), ?, ?, ?, ?, ?, ?)', 
        [link, concat, author, title, content, cover, dateToMysql(), isDraft], callback);
    });
}

exports.get = (author, link, callback = defaultCallback) =>
{
    db.run(`SELECT Posts.author, Posts.link, Posts.title, Posts.cover, Posts.content, Posts.date, Posts.isDraft,
        Users.photo as authorPhoto, Users.name as authorName FROM posts 
        INNER JOIN users ON Posts.author = Users.username
        WHERE author = ? AND link = ?`, [author, link], callback);
}

exports.search = (term, minDate = 0, limit = 10, callback = defaultCallback) =>
{
    db.run('SELECT author, title, link, content, cover, date FROM posts WHERE date > ? AND INSTR(title, ?) > 0 ORDER BY date LIMIT ?', [minDate, term, limit], callback);
}

exports.update = (author, link, newData, callback = defaultCallback) =>
{
    db.run(`UPDATE posts
        SET title = IFNULL(?, title),
        content = IFNULL(?, content),
        cover = IFNULL(?, cover),
        isDraft = IFNULL(?, isDraft)
        WHERE author = ? AND link = ?`, 
    [newData.title, newData.content, newData.cover, newData.isDraft, author, link], callback);
}

exports.delete = (author, link, callback = defaultCallback) =>
{
    db.run(`DELETE FROM posts WHERE author = ? AND link = ?`, [author, link], callback);
}