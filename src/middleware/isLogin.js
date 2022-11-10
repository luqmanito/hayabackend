// otorisasi cek apakah token ada ?
const {checkWhitelistToken} = require ("../repo/users")

const jwt = require("jsonwebtoken")
const response = require("../helpers/response")

const isLogins = async (req, res, next) => {
        const token = req.header("x-access-token")
        if (!token) return res.status(401).json({msg: "You have to please login firsts!", data : null}) 
        const checkToken = await checkWhitelistToken(token);
        if (checkToken.rows.length === 0) {
          return response(res, {
            status: 400,
            message: "You've been logged out, please log back in!",
          });
        }

        //verifikasi
        jwt.verify(token, process.env.secret_key,{issuer: process.env.issuer},(err, decodedPayload) => {
            if (err) {
                console.error(err);
                return res.status(403).json({msg: err.message, data: null} )
            }
            // payload utk cekrole
            // payload akan di attach ke object request
            console.log('-->', decodedPayload);
            req.userPayload = decodedPayload
            next()
        } )
    }

    module.exports = { isLogins };


