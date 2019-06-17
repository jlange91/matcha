module.exports = {
    // verify JWT token
    // Authorization: Bearer <access_token>
    checkJWT: (req, res, next) => {
        // get the bearer token from the request header
        const bearerHeader = req.headers['authorization']
        // check if bearer is undefined
        if (typeof bearerHeader !== 'undefined') {
            // split at the space
            const token = bearerHeader.split(' ')[1]
            // set the token
            req.token = token
            next()
        } else {
            // Forbidden
            res.json({
                'success': false,
                'message': 'No token'
            })
        }
    }

}