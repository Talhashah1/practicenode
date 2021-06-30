const express        = require ('express');
const expressLayouts = require ('express-ejs-layouts');
const mongoose       = require ('mongoose');
const flash          = require('connect-flash');
const session        = require('express-session');
const passport       = require('passport');


const indexRoutes = require("./routes/index");
const userRoutes  = require("./routes/user");

const app = express();

// Passport Config
require("./config/passport")(passport);

// DB config
const db = require('./config/keys').MongoURI;

// Connect to Mongoose
mongoose.connect(db, { useNewUrlParser: true})
    .then( () => console.log("MongoDB connected..."))
    .catch(err => console.log(err));

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//Bodyparser
app.use(express.urlencoded({extended:false}));

//Express Middleware
app.use(session({
    secret: 'Lost Hope',
    resave: true,
    saveUninitialized: true,
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Conenct flash
app.use(flash());

//Global Vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');

    next();
})

//Routes
app.use('/', indexRoutes)
app.use('/users', userRoutes)

app.listen(3003, ()=> {
    console.log("Server start: PORT 3003");
})