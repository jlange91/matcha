const connection = require('../../middleware/database')

class ImagesSchema {

    static createTable() {
        const sql = 'CREATE TABLE IF NOT EXISTS images ( \
             name VARCHAR(255) PRIMARY KEY, \
             user_id INT NOT NULL, \
             CONSTRAINT UN_tag UNIQUE (name), \
             FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE)'

        connection.query(sql, (err) => {if (err) console.log('Error while creating images table ', err) })
    }

}

module.exports = ImagesSchema
