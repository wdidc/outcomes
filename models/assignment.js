var request = require("request")
var env = require("../env")
console.log(env.ASSIGNMENTS_API_TOKEN)
var Assignment = function(id, callback){
  try{ 
    request("http://api.wdidc.org/assignments/"+id+".json?api_token=" + env.ASSIGNMENTS_API_TOKEN, function(err,res,body){
      console.log(body)
      callback(JSON.parse(body)) 
    })
  } catch(e){
    callback(e)
  }
}

Assignment.all = function(callback){
  request("http://assignments.wdidc.org/assignments.json?api_token=" + env.ASSIGNMENTS_API_TOKEN, function(err,res,body){
    console.log(body)
    var asss = JSON.parse(body)
    var outcomesAsss = []
    for( var i = 0 ; i < asss.length; i++ ){
      if(asss[i].assignment_type == "outcomes"){
        outcomesAsss.push(asss[i])
      } 
    }
    callback(outcomesAsss.reverse()) 
  })
}

module.exports = Assignment
