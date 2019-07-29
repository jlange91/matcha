const UserFaker = require('./faker/UserFaker')
const UserProfilFaker = require('./faker/UserProfilFaker')
const MatchFaker = require('./faker/MatchFaker')

class Faker {
    static start () {
        setTimeout(() => {
            UserFaker.setRows()
            setTimeout(() => {
                UserProfilFaker.setRows(),
                MatchFaker.setRows()
            }, 1000)
        }, 3000)
    }
}

module.exports = Faker
