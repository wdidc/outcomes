var request = require("request")
module.exports = function( accessToken, callback ){
  request({
    url: "https://api.github.com/user?access_token=" + accessToken,
    method: "GET",
    headers: {
      "User-Agent":"GADC Outcomes"
    }
  }, function(err,response,body){
    var user = JSON.parse(body)
    request({
      url: "https://api.github.com/teams/1511667/members?access_token=" + accessToken,
      method: "GET",
      headers: {
	"User-Agent":"GADC Outcomes"
      }
    }, function(err,response,body){
      var instructors = JSON.parse(body)
      for(var i = 0; i < instructors.length; i++ ){
        if(instructors[i].id == user.id) {
          user.role = "instructor"	
          callback(user)
          return
	}
      }
      user.role = "student"
      callback(user) 
    }) 
  }) 
}