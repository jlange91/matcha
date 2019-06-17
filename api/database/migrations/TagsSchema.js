const connection = require('../../middleware/database')

class TagsSchema {

    static createTable() {
        const sql = 'CREATE TABLE IF NOT EXISTS tags ( \
             id INT AUTO_INCREMENT PRIMARY KEY, \
             name VARCHAR(255), \
             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, \
             CONSTRAINT UN_tag UNIQUE (name))'

        connection.query(sql, (err) => {if (err) console.log('Error while creating tags table ', err) })
    }

}

module.exports = TagsSchema