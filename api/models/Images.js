const connection = require('../middleware/database')
const e = require('escape-html')

class Images {

  static async count(id) {
    const sql = 'SELECT DISTINCT * FROM images \
                WHERE user_id = ?'

    const images = await connection.query({
          sql,
          timeout: 40000,
          values: [e(id)]
    })

    return (images.length);
  }

  static async push(id, filename) {
    const sql = 'INSERT INTO images (user_id, name) \
                  VALUES (?, ?)'

    let result = await connection.query({
        sql,
        timeout: 40000,
        values: [e(id), e(filename)]
    })
    return (!result) ? false : true;
  }

  static async currentUserImage(id, filename) {
    const sql = 'SELECT user_id FROM images \
            WHERE user_id != ? AND name = ?'

    const result = await connection.query({
        sql,
        timeout: 40000,
        values: [e(id), e(filename)]
    })
    return (!result) ? false : true;
  }

  static async getUserImages(id) {
    const sql = 'SELECT DISTINCT name FROM images \
              WHERE user_id = ?'

    const images = await connection.query({
                    sql,
                    timeout: 40000,
                    values: [id]
                })

      return images || [];
  }


  static async delete(id, filename) {
    const sql = 'DELETE FROM images \
                WHERE images.user_id = ? \
                AND images.name = ?'

    await connection.query({
        sql,
        timeout: 40000,
        values: [e(id), e(filename)]
    })
  }


}

module.exports = Images
