const express = require('express');

const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash =  require('connect-flash');
const session =  require('express-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const app = express();


//passport config
require('./config/passport')(passport);
//Connect to mongo

const db = require('./config/keys').MongoURI;
//const db = 'mongodb://localhost:27017/JWT';
console.log(db);

mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));
//EJS
app.use(expressLayouts);
app.set('view engine','ejs');
//Body parser
app.use(express.urlencoded({extended: true }));

//express session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
   
  }));
  //passport middleware
  app.use(passport.initialize());
  app.use(passport.session());
 //connect flash
 app.use(flash()) ;

 //global vars
 app.use((req,res,next)=> {
     res.locals.success_msg = req.flash('success_msg');
     res.locals.error_msg = req.flash('error_msg');
     res.locals.error = req.flash('error');
     next();
 });
//routes
app.use ('/',require('./routes/index'));
app.use('/users',require('./routes/user'));
//app.use('/profile',passport.authenticate('jwt', {session: false}),require('./routes/profile'));
const port = process.env.port||5000;

app.listen(port,console.log(`Server started to the port${port} `));