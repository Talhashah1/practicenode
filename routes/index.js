const router = require('express').Router();

// Welcome Page
router.get('/', (req, res) => {res.render('welcome')});

//Register Page
router.get('/dashboard', (req, res) => {res.render('dashboard')});

module.exports = router;