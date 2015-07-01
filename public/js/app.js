window.addEventListener("message", function(event){
  console.log(event)
  window.location = "/sessionize?accessToken=" + event.data
})