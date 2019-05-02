module.exports = {
    ensureAuthenticated :function (req,res,next){
        if(req.isAuthenticated()){
            return next;
        }
        req.flash('error_msg','please login to view the resources');
        res.redirect('users/login');
    }
};