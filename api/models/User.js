const bcrypt = require("bcryptjs");
const connection = require('../middleware/database')
const crypto = require('crypto')
const mail = require('../helpers/mailer')
const e = require('escape-html')

class User {
    static async create(newUser) {
      const found = await User.findOne(newUser.email, newUser.username)
      if (found) {
          return {
              'success': false,
              'message': 'Username or email already exist'
          }
      }

      const createdUser = await User.createUser(newUser)
      if (!createdUser) {
          return {
              'success': false,
              'message': 'Sorry we couldn\'t create your account please try again'
          }
      }

      const createdProfil = await User.createUserProfil(createdUser, newUser.location)
      if (!createdProfil) {
          return {
              'success': false,
              'message': 'Sorry we couldn\'t create your profil please try again'
          }
      }

      const sendEmailConfirmation = await User.sendEmailConfirmation(createdUser, newUser.email)
      if (!sendEmailConfirmation) {
          // erase user account
          User.delete(createdUser)
          return {
              'success': false,
              'message': 'Sorry we couldn\'t send your email confirmation so we deleted your account please try again'
          }
      }

      return {
          'success': true,
          'message': 'Please check your inbox to confirm your account'
      }
    }

    static async delete(userId) {
        try {
          const sql = 'DELETE FROM users WHERE users.id = ?'

          const result = await connection.query({
              sql,
              timeout: 40000,
              values: [userId]
          })
          return result
        } catch (error) {
            throw new Error('DELETE failed in model User.delete ' + error)
        }
    }

    static async sendEmailConfirmation(userId, email) {
        try {
            const sql = 'INSERT INTO email_confirmations (user_id, email, hash) \
                                 VALUES (?, ?, ?)'
            const hash = crypto.randomBytes(16).toString('hex');
            const result = await connection.query({
                sql,
                timeout: 40000,
                values: [userId, email, hash]
            })
            if (!result) {
                return false
            }
            let sentEmail = await User.sendEmail(email, hash)
            if (sentEmail)
                return true
            return false
          } catch (error) {
              throw new Error('INSERT failed in model User.sendEmailConfirmation ' + error)
          }
    }

    static async sendEmail(email, hash) {
        try {
            const url = `http://localhost/user/${email}/confirmation/${hash}`
            const subject = "Confirm your account before you log in 👉👌"
            const message = `Thank you for creating an account before you can log in
                                please confirm your email by clicking the link below <br>
                                <a href="${url}">confirm account 😏</a>`

            const sent = await mail.email(email, subject, message)

            if (!sent)
                return false
            return true
        } catch (error) {
            throw new Error('Error sendEmail in model User.sendEmail' + error)
        }
    }

    static async createUserProfil(createdUser) {
        try {
            const sql = 'INSERT INTO profils (user_id) \
                         VALUES (?)'

            let result = await connection.query({
                sql,
                timeout: 40000,
                values: [createdUser]
            })

            if (!result)
                return false
            return true
          } catch (error) {
              throw new Error('INSERT failed in model User.createUserProfil ' + error)
          }
    }

    static async createUserLocation(id, location) {
        try {

            const geo = JSON.stringify(location)
        
            const sql = `INSERT INTO location_users (user_id, geo, lat, lng)
                            VALUES (?, ?, ?, ?)
                        ON DUPLICATE KEY UPDATE geo = ?, lat = ?, lng = ?`

            const result = await connection.query({
                sql,
                timeout: 40000,
                values: [id, geo, location.ll[0], location.ll[1], geo, location.ll[0], location.ll[1]]
            })

            console.log('SQL ' + sql)
            console.log('result ' + result)
            if (!result)
                return false
            return true
        } catch (error) {
            throw new Error('INSERT failed in model User.createUserLocation ' + error)
        }
    }

    static async updatePassword(email, password) {
        try {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);
            const sql = 'UPDATE users \
            SET users.password = ? \
            WHERE users.email = ?'

            const result = await connection.query({
                sql,
                timeout: 40000,
                values: [hash, email]
            })

            if (!result)
                 return false
            return true
        } catch (error) {
            throw new Error('UPDATE failed in model User.updatePassword ' + error)
        }
    }

    static async createUser(newUser) {
        try {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(newUser.password, salt);
            const sql = 'INSERT INTO users (email, username, first_name, last_name, password) \
                         VALUES (?, ?, ?, ?, ?)'

            const result = await connection.query({
                sql,
                timeout: 40000, // 40s
                values: [
                    newUser.email,
                    newUser.username,
                    newUser.first_name,
                    newUser.last_name,
                    hash,
                ]
            })
            if (!result)
                return false
            return result.insertId
        } catch (error) {
            throw new Error('INSERT failed in model User.createUser ' + error)
        }
    }

    static async findOne(email, username) {
        try {
            const sql = 'SELECT DISTINCT * FROM users \
                WHERE users.email = ? \
                OR users.username = ?'

            const result = await connection.query({
                sql,
                timeout: 40000,
                values: [email, username]
            })
            if (result && !result.length)
                return false
            return result
        } catch (error) {
            throw new Error('SELECT failed in model User.findOne ' + error)
        }

    }

    static async confirmAccount(email) {
        try {
            const sql = 'UPDATE users \
            SET users.confirmed = 1 \
            WHERE users.email = ?'

            const result = await connection.query({
                sql,
                timeout: 40000,
                values: [email]
            })
            if (!result)
                return false
            return true
        } catch (error) {
            throw new Error('UPDATE failed in model User.confirmAccount ' + error)
        }
    }

    static async comparePassword(password) {
        try {
            const result = await bcrypt.compareSync(password, 10); // true
            return result
        } catch (error) {
            throw new Error('bcrypt compare error in model User.comparePassword ' + error)
        }
    }

    static async passwordReset(user) {
        try {
            // check if password reset exist for that user
            const passwordReset = await User.hasPasswordReset(user.id)
            // if it exist delete it
            if (passwordReset)
                await User.deletePasswordReset(user[0].email)

            const hash = crypto.randomBytes(16).toString('hex');

            const newPasswordReset = await User.createPasswordReset(user[0].id, user[0].email, hash)

            if (!newPasswordReset)
                return false

            const mail = await User.sendPasswordResetEmail(user[0].email, hash)

            return mail
        } catch (error) {
            throw new Error('Password error in model User.passwordReset' + error)
        }
    }

    static async sendPasswordResetEmail(email, hash) {
        try {
            const url = `http://localhost/password-reset/${email}/${hash}`
            const subject = "Please reset your password 👉👌"
            const message = `You can reset your password by clicking the link below <br>
                                <a href="${url}">reset password</a>`

            const sent = await mail.email(email, subject, message)

            if (!sent)
                return false
            return true
        } catch (error) {
            throw new Error('Error sendEmail in model User.sendPasswordResetEmail' + error)
        }
    }

    static async createPasswordReset(userId, userEmail, hash) {
        try {
            const sql = 'INSERT INTO password_resets (user_id, email, hash)\
                        VALUES (?, ?, ?)'

            const result = await connection.query({
                sql,
                timeout: 40000,
                values: [userId, userEmail, hash]
            })
            if (!result)
                return false
            return true
        } catch (error) {
            throw new Error('INSERT failed in model User.createPasswordReset ' + error)
        }
    }

    static async deletePasswordReset(email) {
        try {

            const sql = 'DELETE FROM password_resets \
                         WHERE email = ?'

            const result = await connection.query({
                sql,
                timeout: 40000,
                values: [email]
            })

            if (!result)
                return false
            return true
        } catch (error) {
            throw new Error('DELETE failed in model User.deletePasswordReset ' + error)
        }
    }

    static async hasPasswordReset(userId) {
        try {
            const sql = 'SELECT * FROM password_resets \
                         WHERE password_resets.user_id = ?'

            const result = await connection.query({
                sql,
                timeout: 40000,
                values: [userId]
            })
            if (!result)
                return false
            return true
        } catch (error) {
            throw new Error('SELECT failed in model User.hasPasswordReset ' + error)
        }
    }

    static async getUsernameFromId(userId) {
        try {
            const sql = 'SELECT username FROM users \
                         WHERE id = ?'

            const result = await connection.query({
                sql,
                timeout: 40000,
                values: [userId]
            })
            return (result && result.length) ? result[0].username : false;
        } catch (error) {
            throw new Error('Select failed in model User.getUsernameFromId ' + error)
        }
    }

    static async isSameAvatar(id, filename) {
        try {
          const sql = 'SELECT * FROM users \
                      WHERE id = ? AND avatar = ?'

          const result = await connection.query({
              sql,
              timeout: 40000,
              values: [e(id), e(filename)]
          })
          return (!result) ? false : true;
        } catch (error) {
            throw new Error('Select failed in model User.isSameAvatar ' + error)
        }
    }

    static async updateAvatar(id, filename) {
      try {
        const sql = 'UPDATE users \
                    SET users.avatar = ? \
                    WHERE users.id = ?'

        await connection.query({
            sql,
            timeout: 40000,
            values: [e(filename), e(id)]
        })
      } catch (error) {
          throw new Error('Update failed in model User.updateAvatar ' + error)
      }
    }

    static async getAllUsers(id) {
      try {
        const sql = 'SELECT DISTINCT users.*, GROUP_CONCAT(tags.name) AS user_tags FROM users \
                LEFT JOIN user_tag AS current_user_tags ON current_user_tags.user_id = users.id \
                LEFT JOIN tags ON tags.id = current_user_tags.tag_id \
                WHERE users.id != ? \
                GROUP BY users.id'

        const users = await connection.query({
            sql,
            timeout: 40000,
            values: [e(id)]
        })
        return users;
      } catch (error) {
          throw new Error('Update failed in model User.getAllUsers ' + error)
      }
    }

}

module.exports = User
