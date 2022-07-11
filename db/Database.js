const mysql = require('mysql');

class Database
{
    static connectData;

    initializeTables()
    {
        this.#createUsersTable(() => this.#createPostsTable(() => this.#createCommentsTable()));
    }

    run(sql, params = [], callback = (error, results, fields) => {})
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

    #createUsersTable = (after) =>
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
        )`, [], after);
    }

    #createPostsTable = (after) =>
    {
        this.run(`CREATE TABLE IF NOT EXISTS posts (
            id VARCHAR(36) PRIMARY KEY,
            link VARCHAR(66) NOT NULL,
            author VARCHAR(32) NOT NULL,
            title VARCHAR(64) NOT NULL,
            content LONGTEXT NOT NULL,
            cover VARCHAR(255),
            date DATETIME NOT NULL,
            isDraft BOOLEAN NOT NULL DEFAULT 1,
            FOREIGN KEY (author) REFERENCES Users(username) ON UPDATE CASCADE ON DELETE CASCADE
        )`, [], after);
    }

    #createCommentsTable = () =>
    {
        this.run(`CREATE TABLE IF NOT EXISTS comments (
            id VARCHAR(36) PRIMARY KEY,
            author VARCHAR(32) NOT NULL,
            content LONGTEXT NOT NULL,
            date DATETIME NOT NULL,
            postId VARCHAR(36) NOT NULL,
            FOREIGN KEY (author) REFERENCES Users(username) ON UPDATE CASCADE ON DELETE CASCADE,
            FOREIGN KEY (postId) REFERENCES Posts(id) ON DELETE CASCADE
        )`);
    }
}

module.exports = Database;