const mysql = require('mysql');

class Database
{
    static connectData;

    static initializeTables(then = () => {})
    {
        this.#createUsersTable(() => this.#createPostsTable(() => this.#createCommentsTable(then)));
    }

    static run(sql, params = [], callback = (error, results, fields) => {})
    {
        const connection = mysql.createConnection(Database.connectData);

        connection.connect();
        connection.query(sql, params, (error, results, fields) =>
        {
            if (error) console.log(error);

            callback(error, results, fields);
        });
        connection.end();
    }

    static #createUsersTable = (then) =>
    {
        this.run(`CREATE TABLE IF NOT EXISTS users (
            username VARCHAR(32),
            name VARCHAR(32) NOT NULL,
            email VARCHAR(150),
            role VARCHAR(16) NOT NULL DEFAULT "user",
            photo VARCHAR(255),
            about VARCHAR(250),
            password VARCHAR(255) NOT NULL,
            PRIMARY KEY (username, email)
        )`, [], then);
    }

    static #createPostsTable = (then) =>
    {
        this.run(`CREATE TABLE IF NOT EXISTS posts (
            id VARCHAR(36) PRIMARY KEY,
            link VARCHAR(255) NOT NULL,
            author VARCHAR(32) NOT NULL,
            title VARCHAR(64) NOT NULL,
            content LONGTEXT NOT NULL,
            cover VARCHAR(255),
            tags TEXT,
            date DATETIME NOT NULL,
            isDraft BOOLEAN NOT NULL DEFAULT 1,
            FOREIGN KEY (author) REFERENCES Users(username) ON UPDATE CASCADE ON DELETE CASCADE
        )`, [], then);
    }

    static #createCommentsTable = (then) =>
    {
        this.run(`CREATE TABLE IF NOT EXISTS comments (
            id VARCHAR(36) PRIMARY KEY,
            author VARCHAR(32) NOT NULL,
            content LONGTEXT NOT NULL,
            date DATETIME NOT NULL,
            postId VARCHAR(36) NOT NULL,
            mainId VARCHAR(36),
            FOREIGN KEY (author) REFERENCES Users(username) ON UPDATE CASCADE ON DELETE CASCADE,
            FOREIGN KEY (postId) REFERENCES Posts(id) ON DELETE CASCADE
        )`, [], then);
    }
}

module.exports = Database;