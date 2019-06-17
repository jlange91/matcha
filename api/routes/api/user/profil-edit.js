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

            const sql = 'UPDATE profils \
                SET biography = ?, birthdate = ?, gender = ?, sexual_orientation = ?, completed = 1\
                WHERE profils.user_id = ?'

            const profil = await connection.query({
                sql,
                timeout: 40000,
                values: [bio, birthdate, gender, sex_pref, e(check.id)]
            })

            if (!profil) {
                res.json({
                    'success': false,
                    'message': 'Oops your profil did not get updated try again'
                })
            }

            // need to fix
            // input a,b,c 
            // a and c get created not b
            newTags.forEach(async (tag) => {

                let sql = 'SELECT * FROM tags WHERE name = ?'

                let existingTag = []

                existingTag = await connection.query({
                    sql,
                    timeout: 40000,
                    values: [tag]
                })

                let newTag = null;

                if (!existingTag.length) {
                    sql = 'INSERT INTO tags \
 (name) VALUES (?)'
                    newTag = await connection.query({
                        sql,
                        timeout: 40000,
                        values: [tag]
                    })

                    if (!newTag) {
                        res.json({
                            'success': false,
                            'message': `Oops your tag ${tag} did not get created`
                        })
                    }
                } else {
                    sql = 'DELETE FROM user_tag \
                    WHERE user_id = ?'

                    const dropUserTags = await connection.query({
                        sql,
                        timeout: 40000,
                        values: [e(check.id)]
                    })

                    if (!dropUserTags) {
                        res.json({
                            'success': false,
                            'message': `Oops your tag ${tag} did not get created`
                        })
                    }
                }


                sql = 'INSERT INTO user_tag \
                         (user_id, tag_id) VALUES (?, ?)'

                const userTag = await connection.query({
                    sql,
                    timeout: 40000,
                    values: [e(check.id), newTag ? newTag.insertId : existingTag[0].id]
                })

                if (!userTag.insertId) {
                    return res.json({
                        'success': false,
                        'message': `Oops your tag ${tag} did not get created`
                    })
                }

            })

            res.json({
                'success': true,
                //'message': `Oops your tag ${tag} did not get created`
            })
        } catch (error) {
            throw new Error('Profil edit ' + error)

        }

    })

module.exports = router