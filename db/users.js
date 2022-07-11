const Database = require('./Database');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const db = new Database();
const defaultCallback = (error, results, fields) => {};

async function hash(password)
{
    if (password == null || password == undefined) return null;

    const encrypted = await bcrypt.hash(password, saltRounds);

    return encrypted;
}
async function verify(password, hash)
{
    const comparison = await bcrypt.compare(password, hash);

    return comparison;
}

exports.insert = async (username, email, password, role = "user", callback = defaultCallback) =>
{
    const encrypted = await hash(password);
    const name = username.replace(/_/g, ' ');
    
    db.run('INSERT INTO users (username, name, email, role, password) VALUES (?, ?, ?, ?, ?)', [username.toLowerCase(), name, email.toLowerCase(), role, encrypted], callback);
}

exports.get = (user, byEmail = false, callback = defaultCallback) =>
{
    db.run(`SELECT username, name, role, photo, about FROM users WHERE ${ byEmail ? 'email' : 'username' } = ?`, [user.toLowerCase()], callback);
}

exports.login = (user, password, byEmail = false, callback = (error, success, user) => {}) =>
{
    db.run(`SELECT username, name, role, photo, about, password FROM users WHERE ${ byEmail ? 'email' : 'username' } = ?`, [user.toLowerCase()], async (error, results, fields) =>
    {
        const success = await verify(password, results[0]['password']);

        delete results[0]['password'];

        callback(error, success, success ? results[0] : {});
    });
}

exports.update = async (user, byEmail = false, newData, callback = defaultCallback) =>
{
    const encrypted = await hash(newData.password);
    const newUserName = newData.username ? newData.username.toLowerCase() : null,
        newEmail = newData.email ? newData.email.toLowerCase() : null;

    db.run(`UPDATE users
        SET username = IFNULL(?, username),
        name = IFNULL(?, name),
        email = IFNULL(?, email),
        role = IFNULL(?, role),
        photo = IFNULL(?, photo),
        about = IFNULL(?, about),
        password = IFNULL(?, password)
        WHERE ${ byEmail ? 'email' : 'username' } = ?`, 
    [newUserName, newData.name, newEmail, newData.role, newData.photo, newData.about, encrypted, user.toLowerCase()], callback);
}

exports.delete = (user, byEmail = false, callback = defaultCallback) =>
{
    db.run(`DELETE FROM users WHERE ${ byEmail ? 'email' : 'username' } = ?`, [user.toLowerCase()], callback);
}