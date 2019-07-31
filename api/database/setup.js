const UserSchema = require('./migrations/UserSchema')
const UserProfilSchema = require('./migrations/UserProfilSchema')
const EmailConfirmationSchema = require('./migrations/EmailConfirmationSchema')
const TagsSchema = require('./migrations/TagsSchema')
const UserTagSchema = require('./migrations/UserTagSchema')
const UserLocationSchema = require('./migrations/UserLocationSchema')
const PasswordResetschema = require('./migrations/PasswordResetsSchema')
const ImagesSchema = require('./migrations/ImagesSchema')
const MessagesSchema = require('./migrations/MessagesSchema')
const Likes = require('./migrations/Likes')
const Views = require('./migrations/Views')
const NotificationsSchema = require('./migrations/NotificationsSchema')
const loggedUsers = require('./migrations/loggedUsers')

class Setup {
    static database () {
        setTimeout(() => {
            UserSchema.createTable()
            EmailConfirmationSchema.createTable()
            TagsSchema.createTable()
            setTimeout(() => {
                UserProfilSchema.createTable()
                UserLocationSchema.createTable()
                PasswordResetschema.createTable()
                UserTagSchema.createTable()
                ImagesSchema.createTable()
                MessagesSchema.createTable()
                Likes.createTable()
                Views.createTable()
                NotificationsSchema.createTable()
                loggedUsers.createTable()
            }, 1000)
        }, 3000)
    }
}

module.exports = Setup
