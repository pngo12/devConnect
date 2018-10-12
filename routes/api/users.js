const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypyt = require('bcryptjs')

// Load User Model
const User = require('../../models/user')

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get('/test', (req,res) => res.json({msg: 'Users work'}));

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public

router.post('/register', (req,res) => {
    User.findOne({ email: req.body.email })
    .then(user => {
        if(user) {
            return res.status(400).json({email: 'Email already exists'})
        } else {
            const avatar = gravatar.url(req.body.email,{
                s: '200', // size
                r: 'pg',
                d: 'mm'

            });
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                avatar
            });
            bcrypyt.genSalt(10,(err, salt) => {
                bcrypyt.hash(newUser.password, salt, (err, hash) => {
                    if(err) throw err;
                    newUser.password = hash;
                    newUser.save()
                    .then(user => res.json(user))
                    .catch(err => console.log(err));
                })
            })
        }
    })
})

module.exports = router;

