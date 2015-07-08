var request = require("request")
var Assignment = function(id, callback){
  try{ 
    request("http://api.wdidc.org/assignments/"+id+".json", function(err,res,body){
      console.log(body)
      callback(JSON.parse(body)) 
    })
  } catch(e){
    callback(e)
  }
}

Assignment.all = function(callback){
  request("http://api.wdidc.org/assignments.json", function(err,res,body){
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
