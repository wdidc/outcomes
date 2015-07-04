window.addEventListener("message", function(event){
  console.log(event)
  window.location = "/sessionize?accessToken=" + event.data
})

var formatees = document.querySelectorAll(".js-format-date")
for( var i = 0; i < formatees.length; i++ ){
  var formatee = formatees[i]
  var yyyymmdd = formatee.innerHTML
  var date = moment(yyyymmdd,"YYYY-MM-DD").endOf('day').fromNow()
  formatee.innerHTML = date
}