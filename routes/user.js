const router = require('express').Router();
const bcrypt = require('bcryptjs');
const passport = require('passport')

//User Model
const User = require ('../models/User');

//Login Page
router.get('/login', (req, res) => {res.render('login')});

//Register Page
router.get('/register', (req, res) => {res.render('register')});

//Register Post
router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    if(!name || !email || !password || !password2){
        errors.push({msg: 'Please Enter all Fields'})
    }

    if(name.length < 3){
        errors.push({msg: "Name is too small"})
    }

    if(password !== password2){
        errors.push({msg: "Password do not match"});
    }

    if(password.length < 6){
        errors.push({msg: "Password should be atleast 6 characters"})
    }

    if(errors.length >0){
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    }else {
        User.findOne({ email: email})
         .then(user => {
             if(user){
                 errors.push({msg: 'Email is already registered'});
                 res.render('register',{
                 errors,
                 name,
                 email,
                 password,
                 password2
                });
             }else {
                 const newUser = new User({
                     name,
                     email,
                     password
                 });

                 bcrypt.genSalt(10, (err,salt) => 
                    bcrypt.hash(newUser.password,salt, (err, hash) =>{
                        if(err) throw err;
                        // Set password
                        newUser.password = hash;
                        newUser.save()
                            .then(user => {
                                req.flash('success_msg', "User Registered, You can login now! ")
                                res.redirect('/users/login');
                            })
                            .catch(err => console.log(err))

                 }))
             }
         })
    }
});

// Login Post
router.post('/login', (req, res,next) => {
    passport.authenticate('local', {
        successRedirect : '/dashboard',
        failureRedirect : '/users/login',
        failureFlash : true
    }) (req, res, next);
});

// Logout Handle
router.post('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    req.redirect('/users/login')
});

module.exports = router;