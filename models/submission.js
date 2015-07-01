var request = require("request")
module.exports = function(assignmentId, userId, callback){
  request("http://api.wdidc.org/assignments/"+assignmentId+"/submissions.json", function(err,res,body){
    var subs = JSON.parse(body)
    for(var i = 0; i < subs.length; i++ ){
      if(subs[i].github_id == userId) {
        callback(subs[i])      
      }
    }
  })
}