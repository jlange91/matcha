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
          values: [e(bio), birthdate, gender, sex_pref, e(id)]
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
          values: [userId]
      })
      return profil;
    } catch (error) {
        throw new Error('UPDATE failed in model Profil.updateProfil ' + error)
    }
  }
}

module.exports = Profil
