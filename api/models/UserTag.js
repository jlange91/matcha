const connection = require('../middleware/database')
const e = require('escape-html')

class UserTag {

  static async push(userId, tagId) {
    try {
      const sql = 'INSERT INTO user_tag \
                  (user_id, tag_id) VALUES (?, ?)'

      const userTag = await connection.query({
          sql,
          timeout: 40000,
          values: [e(userId), e(tagId)]
      })
      return userTag
    } catch (error) {
        throw new Error('INSERT failed in model Tag.pushUserTag ' + error)
    }
  }

  static async getByUserId(userId) {
    try {
      const sql = 'SELECT tags.id, tags.name FROM tags \
                   JOIN user_tag WHERE user_tag.user_id = ? \
                   AND user_tag.tag_id = tags.id ORDER BY BINARY tags.name'

      const user_tags = await connection.query({
          sql,
          timeout: 40000,
          values: [e(userId)]
      })
      return user_tags;
    } catch (error) {
        throw new Error('Select failed in model UserTag.getByUserId ' + error)
    }
  }

  static async deleteByUserId(userId) {
    try {
        const sql = 'DELETE FROM user_tag \
                    WHERE user_id = ?'

        const dropUserTags = await connection.query({
            sql,
            timeout: 40000,
            values: [e(userId)]
        })
        return dropUserTags;
    } catch (error) {
        throw new Error('DELETE failed in model Tag.deleteUserTagByUserId ' + error)
    }
  }

}

module.exports = UserTag
