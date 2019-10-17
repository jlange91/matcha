const connection = require('../middleware/database')
const e = require('escape-html')
const Profil = require('./Profil')

class Match {

  static async isMatch(userId, matchId) {
    try {
      const sql = 'SELECT * FROM likes WHERE (user_id = ? AND liked_id = ?) OR (user_id = ? AND liked_id = ?)'
      const match = await connection.query({
          sql,
          timeout: 40000,
          values: [e(userId), e(matchId), e(matchId), e(userId)]
      })
      return (match && match.length == 2) ? true : false;
    } catch (error) {
        throw new Error('Select failed in model Match.isMatch ' + error)
    }
  }

  static async getAllMatch(userId) {
    const userGender = await Profil.getGender(userId)

    const filterMatch = (match) => {
      console.log('user: ' + userGender + ' match: ' + match.gender)
      if (userGender == match.gender) {
        return false
      }
      return true
    }

    try {
      const sql = 'SELECT matched_user.id, matched_user.email, matched_user.username, matched_user.first_name, matched_user.last_name, matched_user.avatar, matched_user.confirmed, matched_user.created_at, matched_user.updated_at, matched_user_profil.*, GROUP_CONCAT(tags.name) AS user_tags, COUNT(tags.id) AS total_common_tags, matched_user_location.lng, matched_user_location.lat \
                    FROM users \
                    INNER JOIN users AS matched_user \
                    INNER JOIN user_tag AS matched_tags ON matched_tags.user_id = matched_user.id \
                    INNER JOIN profils AS current_user_profil ON current_user_profil.user_id = users.id \
                    INNER JOIN profils AS matched_user_profil ON matched_user_profil.user_id = matched_user.id \
                    INNER JOIN location_users AS matched_user_location ON matched_user_location.user_id = matched_user.id \
                    INNER JOIN tags ON tags.id = matched_tags.tag_id \
                    WHERE (users.id = ? AND matched_user.id != ? AND matched_user.spam = 0) \
                      GROUP BY matched_user.id, users.id'

      var matchs = await connection.query({
          sql,
          timeout: 40000,
          values: [e(userId), e(userId)]
      })

      if (matchs)
        matchs = matchs.filter(filterMatch)
      return (matchs);
    } catch (error) {
        throw new Error('Select failed in model Match.getAllMatch ' + error)
    }
  }

}

module.exports = Match
