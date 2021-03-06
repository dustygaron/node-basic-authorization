const express = require('express')
const router = express.Router()

// user model
const User = require('../models/user')

// bcrypt to encrypt passwords
const bcrypt = require('bcrypt')
const bcryptSalt = 10

router.get('/signup', (req, res, next) => {
  res.render('auth/signup')
})

router.post('/signup', (req, res, next) => {
  const username = req.body.username
  const password = req.body.password
  const salt = bcrypt.genSaltSync(bcryptSalt)
  const hashPass = bcrypt.hashSync(password, salt)

  User.findOne({ 'username': username })
    .then(user => {
      if (user !== null) {
        res.render('auth/signup', {
          errorMessage: 'The username already exists!'
        })
        return
      }

      if (username === '' || password === '') {
        res.render('auth/signup', {
          errorMessage: 'Indicate a username and a password to sign up'
        })
        return
      }

      User.create({
        username,
        password: hashPass
      })
        .then(() => {
          res.redirect('/')
        })
        .catch(error => {
          console.log(error)
        })
    })
    .catch(err => {
      next(err)
    })
})

module.exports = router
