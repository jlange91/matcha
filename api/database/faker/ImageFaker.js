const connection = require('../../middleware/database')

class ImageFaker {

    static setRows() {
       var sql = 'INSERT IGNORE INTO images \
            (name, user_id) \
            VALUES ("24eef96049084e24a22416565ec45c73.jpg", (SELECT id from users WHERE username = "jlange"))'

        connection.query(sql, (err) => {if (err) console.log('Error while creating image for jlange', err) })

        sql = 'INSERT IGNORE INTO images \
             (name, user_id) \
             VALUES ("8e05472833c74fc3bb1825b3d5364482.jpg", (SELECT id from users WHERE username = "dadacruz"))'

         connection.query(sql, (err) => {if (err) console.log('Error while insert image for dadacruz', err) })
    }

}

module.exports = ImageFaker
