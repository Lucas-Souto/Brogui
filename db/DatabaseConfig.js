const mysql = require('mysql');
//{ host: 'localhost', user: 'me', password: 'secret', database: 'my_db' }

class DatabaseConfig
{
    constructor(connectData)
    {
        this.connectData = connectData;
    }

    run(sql, params = [], callback = (error, results, fields) => {})
    {
        const connection = mysql.createConnection(this.connectData);

        connection.connect();
        connection.query(sql, params, (error, results, fields) =>
        {
            if (error) console.log(error);

            callback(error, results, fields);
        });
        connection.end();
    }
}

module.exports = DatabaseConfig;