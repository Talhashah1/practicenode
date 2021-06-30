module.exports = {
    ensureAuthenticated : (req, res, next) => {
        if(req.isAuthenticated()){
            return next();
        };
        req.flash('error_msg', 'Please login');
        res.redirect('/user/login');

    },
    forwardAuthenticated : (req, res, next) => {
        if(!req.isAuthenticated()){
            return next();
        }
        res.redirect('/dashboard');
    }
}