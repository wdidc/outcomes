var express = require("express")
var app = express()
var session = require("express-session")
var User = require("./models/user")
app.set('view engine','hbs')
app.use(express.static('public'))
app.use(session({
  secret: "meow",
  saveUninitialized: true,
  resave: true
}))

app.get("/", function(req, res){
  if(req.session.role == "student"){
    res.render("student",{
      currentUser: req.session.currentUser 
    })
  }else{
    res.render("index")
  }
})

app.get("/sessionize", function(req,res){
  var user = User(req.query.accessToken, function( user ){
    req.session.currentUser = user
    req.session.role = "student"
    res.redirect("/")
  })
})

app.get("/logout", function(req, res){
  req.session.destroy()
  res.redirect("/")
})

app.listen(2372, function(){
  console.log("listening on port 2372")
})