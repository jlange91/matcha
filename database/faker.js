const UsersFaker = require('./faker/UsersFaker')
const UserProfilFaker = require('./faker/UsersProfilFaker')
const LikesFaker = require('./faker/LikesFaker')
const ImageFaker = require('./faker/ImageFaker')
const UsersLocationFaker = require('./faker/UsersLocationFaker')
const connection = require('./config/database.js')
const faker = require('faker')

// set the db for the rest of the queries
connection.config.connectionConfig.database = process.env.DB_NAME
// set faker locale
faker.locale = "fr"

const exitProperly = () => {
  process.exit()
}

class Faker {
  constructor(param) {
    this.fakeUsers = []
    let tmpUser = {}
    let genders = ["male", "female"]
    let sexual_orientation = ["bisexual", "female", "male"]
    for (var i = 0; i < param.limit; i++)
    {
      tmpUser.username = faker.internet.userName()
      tmpUser.firstName = faker.name.firstName()
      tmpUser.lastName = faker.name.lastName()
      tmpUser.email = faker.internet.email()
      tmpUser.birthdate = faker.date.past(10, '2000-01-01')
      tmpUser.gender = genders[faker.random.number(1)]
      tmpUser.sexual_orientation = sexual_orientation[faker.random.number(2)]
      tmpUser.biography = faker.lorem.paragraph()
      this.fakeUsers.push(tmpUser)
      tmpUser = {}
    }
    this.setAll()
  }

  async setAll() {
    await this.setAdmins()
    await this.setUsers()
    exitProperly()
  }

  async setAdmins() {
    await UsersFaker.setAdmins()
    await UserProfilFaker.setAdmins()
    await LikesFaker.setAdmins()
    await ImageFaker.setAdmins()
  }

  async setUsers() {
    await UsersFaker.setUsers(this.fakeUsers)
    await UserProfilFaker.setUsers(this.fakeUsers)
    await UsersLocationFaker.setUsersLocation(this.fakeUsers)
  }
}

new Faker({limit: 100});
