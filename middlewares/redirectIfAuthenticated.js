module.exports = {
  redirectIfAuthenticated: (req, res, next) => {
    if (!req.isAuthenticated()) {
      return next();
    }
    req.flash('success_msg', 'You already Logged In !');
    return res.redirect('/dashboard');
  },
};
