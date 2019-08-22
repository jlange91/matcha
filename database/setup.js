const UserSchema = require('./migrations/UserSchema')
const UserProfilSchema = require('./migrations/UserProfilSchema')
const EmailConfirmationSchema = require('./migrations/EmailConfirmationSchema')
const TagsSchema = require('./migrations/TagsSchema')
const UserTagSchema = require('./migrations/UserTagSchema')
const UserLocationSchema = require('./migrations/UserLocationSchema')
const PasswordResetschema = require('./migrations/PasswordResetsSchema')
const ImagesSchema = require('./migrations/ImagesSchema')
const MessagesSchema = require('./migrations/MessagesSchema')
const LikesSchema = require('./migrations/LikesSchema')
const ViewsSchema = require('./migrations/ViewsSchema')
const NotificationsSchema = require('./migrations/NotificationsSchema')
const LoggedUsers = require('./migrations/loggedUsers')
const connection = require('./config/database.js')

const createDatabase = async () => {
  try {
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`)
    // set the db for the rest of the queries
    connection.config.connectionConfig.database = process.env.DB_NAME
  } catch (err) {
    throw new Error('Database creation failed in database/config ' + err)
  }
}

const exitProperly = () => {
  process.exit()
}

class Setup {
    async database () {
      await createDatabase()
      await UserSchema.createTable()
      await EmailConfirmationSchema.createTable()
      await TagsSchema.createTable()
      await UserProfilSchema.createTable()
      await UserLocationSchema.createTable()
      await PasswordResetschema.createTable()
      await UserTagSchema.createTable()
      await ImagesSchema.createTable()
      await MessagesSchema.createTable()
      await LikesSchema.createTable()
      await ViewsSchema.createTable()
      await NotificationsSchema.createTable()
      await LoggedUsers.createTable()
      exitProperly()
    }
}

const setup = new Setup();
setup.database()
