const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const e = require('escape-html')
const connection = require('../../../middleware/database')
const {
    checkJWT
} = require('../../../middleware/check_token')
const {
    check,
    validationResult
} = require('express-validator/check');
const Profil = require('../../../models/Profil.js')
const Tag = require('../../../models/Tag.js')
const UserTag = require('../../../models/UserTag.js')

// profil
router.post('/', [
        checkJWT,
        check('birthdate').trim().escape().custom((value) => {
            if (!value.match(/^\d{4}-\d{2}-\d{2}$/)) return false;

            const date = new Date(value);
            if (!date.getTime()) return false;
            return date.toISOString().slice(0, 10) === value;
        }).withMessage('the date must be valid'),
        // check('login').not().isEmpty().trim().escape().withMessage('Please provide your username or email'),
        check('bio').trim().escape().isLength({
            min: 6,
            max: 10000
        }).withMessage('Your bio must be between 6 and 10000 characters'),
        check('gender')
        .not().isEmpty().trim().escape()
        .isIn(['men', 'female', 'male'])
        .withMessage('Please add a valid gender'),
        check('sex_pref')
        .not().isEmpty().trim().escape()
        .isIn(['men', 'female', 'bisexual'])
        .withMessage('Please add a valid sexual preference'),
        check('tags')
        .isArray()
        .not().isEmpty()
        .withMessage('Please add some tags'),

    ],
    async (req, res, next) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                const error_response = {
                    'success': false,
                    'message': 'Please validate your inputs',
                    'errors': errors.array()
                }
                return res.json(error_response)
            }

            const check = jwt.verify(req.token, process.env.APP_KEY, (err, authData) => {
                if (err) return false
                return authData
            })

            if (!check) {
                res.json({
                    'success': false,
                    'message': 'Forbidden'
                })
            }

            let {
                birthdate,
                gender,
                sex_pref,
                bio,
                tags
            } = req.body

            const newTags = await tags.map(tag => e(tag.toLowerCase()))


            if (sex_pref === 'men')
                sex_pref = 'male'

            if (gender === 'men')
                gender = 'male'

            const profil = await Profil.updateProfil(bio, birthdate, gender, sex_pref, check.id)

            if (!profil) {
                return res.json({
                    'success': false,
                    'message': 'Oops your profil did not get updated try again'
                })
            }

            const dropUserTags = await UserTag.deleteByUserId(check.id)

            if (!dropUserTags) {
                return res.json({
                    'success': false,
                    'message': `Oops your tag ${tag} did not get created`
                })
            }
            newTags.forEach(async (tag) => {
                let sql
                let existingTag = []
                let newTag = null;

                existingTag = await Tag.getByName(tag)
                if (!existingTag.length) {
                  newTag = await Tag.push(tag)

                  if (!newTag) {
                    return res.json({
                        'success': false,
                        'message': `Oops your tag ${tag} did not get created`
                    })
                  }
                }

                const userTag = await UserTag.push(check.id, newTag ? newTag.insertId : existingTag[0].id)

                if (!userTag.insertId) {
                    return res.json({
                        'success': false,
                        'message': `Oops your tag ${tag} did not get created`
                    })
                }
            })

            res.json({
                'success': true,
            })
        } catch (error) {
            throw new Error('Profil edit ' + error)

        }

    })

module.exports = router
