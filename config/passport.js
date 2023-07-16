const LocalStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

// Load User Model
const User = require('../models/User')

module.exports =  (passport)=> {
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
            // Match User
            let user = await User.findOne({ email: email })
            if (!user) {
                return done(null, false, { message: 'That email is not registered !' })
            } else {
                // Match password 
                let isMatch = await bcrypt.compare(password, user.password)

                if (isMatch) {
                    return done(null, user)
                } else {
                    return done(null, false, { message: 'password incorrect !' })
                }
            }
        })
    )
    passport.serializeUser( (user, done)=> {
        done(null, user.id)
    })
    passport.deserializeUser(async  (id, done)=> {

        let user = await User.findById(id)
        done(null, user)

    })
}