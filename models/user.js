var request = require("request")
module.exports = function( accessToken, callback ){
  request({
    url: "https://api.github.com/user?access_token=" + accessToken,
    method: "GET",
    headers: {
      "User-Agent":"GADC Outcomes"
    }
  }, function(err,response,body){
    callback(JSON.parse(body)) 
  }) 
}