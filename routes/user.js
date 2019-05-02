const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt =  require('bcryptjs');
const passport = require('passport');
const jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
// create application/json parser
var jsonParser = bodyParser.json()
 
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })
//login
router.get('/login',(req,res)=> res.render('login'));
//register
router.get('/register',(req,res)=> res.render('register'));
//register handle
router.post('/register',(req,res)=>{
    const {name,email,password,password2}=req.body;
    let errors = [];
    

    //check for rrequired fields
    if(!name||!email||!password||!password2){
        errors.push({msg:'Please fill in all fields'});
    }
    //check for passwords match
    if(password !== password2){
        errors.push({msg:'Passwords do not match'});

    }
    //check for password length
    if(password.length <6){
        errors.push({msg:'Passwords should be atleast 6 charecters length'});
    }

    if(errors.length>0){
        console.log('coming here');
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
          });
    }else{
        //validation passed
        User.findOne({email:email})
        .then(user =>{
            if(user){
                //user exists
                errors.push({msg:'Email is already exiss'});
                res.render('register',{errors,name,email,password,password2});
            }else{
                const newUser = new User({
                 name,email,password

                });
                /* hasing password*/
                bcrypt.genSalt(10,(err,salt)=>
                 bcrypt.hash(newUser.password,salt,(err,hash) =>{
                    if(err){
                        throw err;
                    }
                    //set password to hash
                    newUser.password=  hash;
                    //save user
                    newUser.save()
                    .then(user =>{ 
                        req.flash('success_msg','You are registered successfully');
                        res.redirect('/users/login')})
                    .catch(err => console.log(err));
                 }));
            }
        });
    }
});

//login handle
router.post('/login',(req,res,next) =>{
    passport.authenticate('local',{
        successRedirect:'/dashboard',
        failureRedirect:'/users/login',
        failureFlash:true
    })(req,res,next)
});

/* router.post('/login',urlencodedParser ,(req, res,next) => {
console.log('inside login');
console.log(req.body);
    passport.authenticate('local',(err, user, info) => {
        console.log('err',err);
        console.log('user',user);
        console.log('info',info);
        if (info != undefined) {
            console.log(info.message);
            return res.status(400).json({
                message: info ? info.message : 'Login failed',
                user   : user
            });
        }

        req.login(user, (err) => {
            if (err) {
                console.log('err',err);
                res.send(err);
            }
            console.log('user',user);
            const token = jwt.sign(user ,'moneypalfucks');
            console.log('token',token);
            return res.redirect('/dashboard',{user, token});
        });
    })(req, res,next);

}); */
/* router.post('/login', function (req, res) {
    passport.authenticate('local', {session: false}, (err, user, info) => {
        if (err || !user) {
            return res.status(400).json({
                message: 'Something is not right',
                user   : user
            });
        }
       req.login(user, {session: false}, (err) => {
           if (err) {
               res.send(err);
           }
           // generate a signed son web token with the contents of user object and return it in the response
           const token = jwt.sign(user, 'moneypalfucks');
           return res.json({user, token});
        });
    })(req, res);
}); */
/* router.post('/login', async (req, res,next) => {
    passport.authenticate('local', async (err, user, info) => {     try {
        if(err || !user){
          const error = new Error('An Error occured')
          return next(error);
        }
        req.login(user, { session : false }, async (error) => {
          if( error ) return next(error)
          //We don't want to store the sensitive information such as the
          //user password in the token so we pick only the email and id
          const body = { _id : user._id, email : user.email };
          //Sign the JWT token and populate the payload with the user email and id
          const token = jwt.sign({ user : body },'moneypalfucks');
          //Send back the token to the user
          return res.json({ token });
        });     } catch (error) {
      
      }
    })
  }); */

//logout handle
router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success_msg','You are logged out');
    res.redirect('/users/login');
});
module.exports = router;