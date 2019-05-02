/* const express = require('express');
const router = express.Router();
const {ensureAuthenticated } =require('../config/auth');
const passport = require('../config/passport')

//Dashboard
router.get('/dashboard',ensureAuthenticated,(req,res)=> {
    const name =  req.user.name;
res.render('dashboard'),{
    name:name
};
});

module.exports = router; */