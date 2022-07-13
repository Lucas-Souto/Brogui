const dateToMysql = require('./dateToMysql');
const Database = require('./Database');
const db = new Database();
const defaultCallback = (error, results, fields) => {};

function titleToLink(title)
{
    return title.replace(/ /g, "_").normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9_]+/g, "").toLowerCase();
}

function getContains(fullLink, callback = defaultCallback)
{
    const splited = fullLink.split('/');

    db.run('SELECT * FROM posts WHERE author = ? AND link LIKE ?', [splited[0], splited[1] + "%"], callback);
}

exports.insert = (author, title, content, cover = null, isDraft = true, callback = defaultCallback) =>
{
    const link = titleToLink(title);

    getContains(`${author}/${link}`, (error, rows) =>
    {
        const concat = rows.length != 0 ? rows.length : '';

        db.run('INSERT INTO posts (id, link, author, title, content, cover, date, isDraft) VALUES(uuid(), CONCAT(?, ?), ?, ?, ?, ?, ?, ?)', 
        [link, concat, author, title, content, cover, dateToMysql(), isDraft], callback);
    });
}

exports.get = (fullLink, callback = defaultCallback) =>
{
    const splited = fullLink.split('/');

    db.run(`SELECT Posts.*,
        Users.photo as authorPhoto, Users.name as authorName FROM posts 
        INNER JOIN users ON Posts.author = Users.username
        WHERE author = ? AND link = ?`, [splited[0], splited[1]], callback);
}

exports.search = (term, minDate = 0, limit = 10, callback = defaultCallback) =>
{
    db.run(`SELECT Posts.*,
        Users.photo as authorPhoto, Users.name as authorName FROM posts 
        INNER JOIN users ON Posts.author = Users.username
        WHERE date > ? AND INSTR(title, ?) > 0 ORDER BY date LIMIT ?`, 
    [minDate, term, limit], callback);
}

exports.list = (minDate = 0, limit = 10, callback = defaultCallback) =>
{
    db.run(`SELECT Posts.*,
        Users.photo as authorPhoto, Users.name as authorName FROM posts 
        INNER JOIN users ON Posts.author = Users.username
        WHERE date > ? ORDER BY date LIMIT ?`,
    [minDate, limit], callback);
}

exports.update = (fullLink, newData, callback = defaultCallback) =>
{
    const splited = fullLink.split('/');

    db.run(`UPDATE posts
        SET title = IFNULL(?, title),
        content = IFNULL(?, content),
        cover = IFNULL(?, cover),
        isDraft = IFNULL(?, isDraft)
        WHERE author = ? AND link = ?`, 
    [newData.title, newData.content, newData.cover, newData.isDraft, splited[0], splited[1]], callback);
}

exports.delete = (fullLink, callback = defaultCallback) =>
{
    const splited = fullLink.split('/');

    db.run(`DELETE FROM posts WHERE author = ? AND link = ?`, [splited[0], splited[1]], callback);
}

exports.getId = (fullLink, callback = defaultCallback) =>
{
    const splited = fullLink.split('/');

    db.run('SELECT id FROM posts WHERE author = ? AND link = ?', [splited[0], splited[1]], callback);
}