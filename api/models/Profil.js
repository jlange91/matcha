const connection = require('../middleware/database')
const e = require('escape-html')

class Profil {

  static async updateProfil(bio, birthdate, gender, sex_pref, id) {
    try {
      const sql = 'UPDATE profils \
          SET biography = ?, birthdate = ?, gender = ?, sexual_orientation = ?, completed = 1\
          WHERE profils.user_id = ?'

      const profil = await connection.query({
          sql,
          timeout: 40000,
          values: [e(bio), e(birthdate), e(gender), e(sex_pref), e(id)]
      })
      return profil;
    } catch (error) {
        throw new Error('UPDATE failed in model Profil.updateProfil ' + error)
    }
  }

  static async getByUserId(userId) {
    try {
      let sql = 'SELECT DISTINCT * FROM profils \
                  WHERE profils.user_id = ?'

      const profil = await connection.query({
          sql,
          timeout: 40000,
          values: [e(userId)]
      })
      return profil;
    } catch (error) {
        throw new Error('UPDATE failed in model Profil.updateProfil ' + error)
    }
  }

  static async getLastSeen(userId) {
    try {
      let sql = 'SELECT DISTINCT DATE_FORMAT(last_seen, "%d/%m/%Y %H:%i:%s") AS last_seen \
                  FROM profils \
                  WHERE profils.user_id = ?'

      const last_seen = await connection.query({
          sql,
          timeout: 40000,
          values: [e(userId)]
      })
      return last_seen;
    } catch (error) {
        throw new Error('SELECT failed in model Profil.getLastSeen ' + error)
    }
  }

  static async getUserFameRating(userId) {
    try {
      let sql = 'SELECT profils.fame_rating FROM profils \
                  WHERE profils.user_id = ?'

      const fameRating = await connection.query({
          sql,
          timeout: 40000,
          values: [e(userId)]
      })
      return fameRating;
    } catch (error) {
        throw new Error('SELECT failed in model Profil.getUserFameRating ' + error)
    }
  }

  static async increaseUserFameRating(userId, value) {
    try {
      let fameRating = await this.getUserFameRating(userId)
      if (fameRating[0]) {
        let newFameRating = fameRating[0].fame_rating + value
        let sql = 'UPDATE profils \
                   SET fame_rating = ? \
                   WHERE profils.user_id = ?'
        fameRating = await connection.query({
          sql,
          timeout: 40000,
          values: [e(newFameRating), e(userId)]
        })
        return fameRating;
      }

    } catch (error) {
        throw new Error('UPDATE failed in model Profil.increaseUserFameRating ' + error)
    }
  }

  static async decreaseUserFameRating(userId, value) {
    try {
      let fameRating = await this.getUserFameRating(userId)

      if (fameRating[0]) {
        let newFameRating = fameRating[0].fame_rating - value


      let sql = 'UPDATE profils \
                 SET fame_rating = ? \
                 WHERE profils.user_id = ?'

       fameRating = await connection.query({
        sql,
        timeout: 40000,
        values: [e(newFameRating), e(userId)]
      })

      return fameRating;
      }
    } catch (error) {
        throw new Error('UPDATE failed in model Profil.decreaseUserFameRating ' + error)
    }
  }
}

module.exports = Profil
