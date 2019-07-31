const UserFaker = require('./faker/UserFaker')
const UserProfilFaker = require('./faker/UserProfilFaker')
const LikesFaker = require('./faker/LikesFaker')
const ImageFaker = require('./faker/ImageFaker')

class Faker {
    static start () {
        setTimeout(() => {
            UserFaker.setRows()
            setTimeout(() => {
                UserProfilFaker.setRows(),
                LikesFaker.setRows(),
                ImageFaker.setRows()
            }, 1000)
        }, 3000)
    }
}

module.exports = Faker
