var request = require("request")
var Submission = {
  find: function(assignmentId, userId, callback){
    request("http://api.wdidc.org/assignments/"+assignmentId+"/submissions.json", function(err,res,body){
      var subs = JSON.parse(body)
      for(var i = 0; i < subs.length; i++ ){
	if(subs[i].github_id == userId) {
	  callback(subs[i])      
	}
      }
    })
  }, 
  update: function(opts, callback){
    var url = "http://api.wdidc.org/assignments/"+opts.assignmentId+"/submissions/"+opts.id + ".json?access_token="+opts.accessToken+"&api_token="+env['ASSIGNMENTS_API_TOKEN'] 
    console.log(url)
    request({
      url: url,
      method: "patch",
      form: {
        submission:{
          status: opts.status 		   
        }
      }
    }, function(err, res, body){
      callback(body)
    }) 
  }
}
module.exports = Submission