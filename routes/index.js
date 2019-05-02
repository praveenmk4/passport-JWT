const express = require('express');
const router = express.Router();
const {ensureAuthenticated } =require('../config/auth');
router.get('/',(req,res)=> res.render('welcome'));
//Dashboard
router.get('/dashboard',ensureAuthenticated,(req,res)=> {
    const name =  req.user.name;
res.render('dashboard'),{
    name:name
};
});
module.exports = router;