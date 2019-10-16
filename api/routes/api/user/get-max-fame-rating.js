const express = require('express')
const router = express.Router()
const Profil = require('../../../models/Profil.js')

router.get('/',
    async (req, res, next) => {
      const maxFameRating = await Profil.getMaxFameRating();

      console.log("lol")
      return res.json({
          'success': true,
          'maxFameRating': maxFameRating
      })
    }
  )

module.exports = router
