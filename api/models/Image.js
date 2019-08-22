const connection = require('../middleware/database')
const e = require('escape-html')

class Image {

  static async count(id) {
    try {
      const sql = 'SELECT DISTINCT * FROM images \
                  WHERE user_id = ?'

      const images = await connection.query({
            sql,
            timeout: 40000,
            values: [e(id)]
      })

      return (images.length);
    } catch (error) {
        throw new Error('SELECT failed in model Image.count ' + error)
    }
  }

  static async push(id, filename) {
    try {
      const sql = 'INSERT INTO images (user_id, name) \
                    VALUES (?, ?)'

      let result = await connection.query({
          sql,
          timeout: 40000,
          values: [e(id), e(filename)]
      })
      return (!result) ? false : true;
    } catch (error) {
        throw new Error('INSERT failed in model Image.push ' + error)
    }
  }

  static async currentUserImage(id, filename) {
    try {
      const sql = 'SELECT user_id FROM images \
              WHERE user_id != ? AND name = ?'

      const result = await connection.query({
          sql,
          timeout: 40000,
          values: [e(id), e(filename)]
      })
      return (!result) ? false : true;
    } catch (error) {
        throw new Error('SELECT failed in model Image.currentUserImage ' + error)
    }
  }

  static async getUserImages(id) {
    try {
      const sql = 'SELECT DISTINCT name FROM images \
                WHERE user_id = ?'

      const images = await connection.query({
                      sql,
                      timeout: 40000,
                      values: [id]
                  })

      return images || [];
    } catch (error) {
        throw new Error('SELECT failed in model Image.getUserImage ' + error)
    }

  }


  static async delete(id, filename) {
    try {
      const sql = 'DELETE FROM images \
                  WHERE images.user_id = ? \
                  AND images.name = ?'

      await connection.query({
          sql,
          timeout: 40000,
          values: [e(id), e(filename)]
      })
    } catch (error) {
        throw new Error('DELETE failed in model Image.delete ' + error)
    }
  }

  static async getImageByName(name) {
    try {
      const sql = 'SELECT images.user_id FROM images \
      WHERE images.name = ?'

      const image = await connection.query({
                    sql,
                    timeout: 40000,
                    values: [ e(name)]
                  })
      return image
    } catch (error) {
        throw new Error('SELECT failed in model Image.getImageByName ' + error)
    }
  }


}

module.exports = Image
