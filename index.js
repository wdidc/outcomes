var express = require("express")
var app = express()
var bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
var session = require("express-session")
var User = require("./models/user")
var Assignment = require("./models/assignment")
var Submission = require("./models/submission")
app.set('view engine','hbs')
app.use(express.static('public'))
app.use(session({
  secret: "meow",
  saveUninitialized: true,
  resave: true
}))

app.get("/", function(req, res){
  if(req.session.role == "student"){
    Assignment.all(function(assignments){
      res.render("student",{
	currentUser: req.session.currentUser,
	assignments: assignments
      })
    })
  }else{
    res.render("index")
  }
})

app.get("/sessionize", function(req,res){
  req.session.accessToken = req.query.accessToken
  var user = User(req.query.accessToken, function( user ){
    req.session.currentUser = user
    req.session.role = "student"
    res.redirect("/")
  })
})

app.get("/assignments/:id", function(req,res){
 if(req.session.role == "student"){
   Assignment(req.params.id, function(assignment){
     Submission.find(assignment.id, 11844601, function(submission){
       res.render("form",{
	 currentUser: req.session.currentUser,
	 assignment: assignment,
	 submission: submission
       }) 
     })
   })
 } 
})

app.post("/assignments/:assignmentId/submissions/:id", function(req, res){
  Submission.update({
    status: req.body.status,
    assignmentId: req.params.assignmentId,
    id: req.params.id,
    accessToken: req.session.accessToken
  }, function(submission){
    res.send(submission)
    //res.redirect("/assignments/"+ req.params.assignmentId ) 
  })
})

app.get("/logout", function(req, res){
  req.session.destroy()
  res.redirect("/")
})

app.listen(2372, function(){
  console.log("listening on port 2372")
})