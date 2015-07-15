var express = require("express")
var fs = require("fs")
if(fs.existsSync("./env.js")){
  env = require("./env")
} else {
  env = process.env
}
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
  }else if(req.session.role == "instructor"){
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
    req.session.role = user.role
    res.redirect("/")
  })
})

app.get("/assignments/:id", function(req,res){
 if(req.session.role == "instructor"){
   Assignment(req.params.id, function(assignment){
     Submission.all(assignment.id, function(submissions){
       var stats = {complete:0, incomplete:0} 
       for(var i = 0; i < submissions.length; i++){
	 var sub = submissions[i]
         if( sub.status ){
	   stats.complete += 1
	 }else{
	   stats.incomplete += 1
	 }
       }
       stats.percentComplete = Math.floor((stats.complete / submissions.length) * 100)
       stats.percentIncomplete = Math.floor((stats.incomplete / submissions.length) * 100)
       res.render("instructor",{
	 assignment: assignment,
         submissions: submissions,
	 stats: stats
       })
     })
   })
 }else{
   Assignment(req.params.id, function(assignment){
     Submission.find(assignment.id, req.session.currentUser.id, function(submission){
       res.render("form",{
	 currentUser: req.session.currentUser,
	 assignment: assignment,
	 submission: submission,
         success: req.query.success
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
    res.redirect("/assignments/"+ req.params.assignmentId + "?success=true") 
  })
})

app.get("/logout", function(req, res){
  req.session.destroy()
  res.redirect("/")
})

app.listen(2372, function(){
  console.log("listening on port 2372")
})