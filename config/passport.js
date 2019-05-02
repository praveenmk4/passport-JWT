const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcypt = require('bcryptjs');
const passportJWT = require("passport-jwt");
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

//Load user model
const User = require('../models/User');


module.exports = function(passport){
    passport.use(
        new LocalStrategy('local',{
            usernameField:'email'},(email,password,done) => {
                User.findOne({email:email})
            .then(user =>{
                if(!user){
                    return done(null,false,'Email is not registered')
                }
                //Match Pwd
                bcypt.compare(password,user.password,(err,isMatch) =>{
                    if(err){throw err;}
                    if(isMatch){
                        return done(null,user);
                    }else{
                        return done(null,false,{message:'Password incorrect'});
                    }
                });
            })
            .catch(err => console.log(err));
        })
    );
   /*  passport.use(
        new JWTStrategy({
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
            secretOrKey   : 'moneypalfucks'
        },(jwtpayload,cb)=>{
            console.log('payload');
            console.log
            return User.findOne({email:jwtpayload.email})
            .then(user =>{return cb(null,user);})
            .catch(err =>{console.log(err);})
        })
    ) */
   /*  passport.use(new JWTStrategy({
        //secret we used to sign our JWT
        secretOrKey : 'top_secret',
        //we expect the user to send the token as a query paramater with the name 'secret_token'
        jwtFromRequest : ExtractJWT.fromUrlQueryParameter('moneypalfucks')
      }, async (token, done) => {
        try {
          //Pass the user details to the next middleware
          return done(null, token.user);
        } catch (error) {
          done(error);
        }
      })); */
    passport.serializeUser(function (user,done){
        done(null,user.id);
    
    });
    passport.deserializeUser(function(id,done){
        User.findById(id,function(err,user){
            done(err,user);
        });
    });
}