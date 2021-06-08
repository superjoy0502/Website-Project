$(document).ready(function(){
	$(".stuff").fadeIn("slow");
})

$("#interestslink").click(function(){
	$.when($(".stuff").fadeOut("slow")).done(function() {
		window.location.href = "/pages/interests.html";
	});
})

$("#organizationslink").click(function(){
	$.when($(".stuff").fadeOut("slow")).done(function() {
		window.location.href = "/pages/organizations.html";
	});
})

$("#homelink").click(function(){
	$.when($("body").fadeOut("slow")).done(function() {
		window.location.href = "/index.html";
	});
})

$("#contactlink").click(function(){
	$.when($(".stuff").fadeOut("slow")).done(function() {
		window.location.href = "/pages/contact.html";
	});
})

$("#aboutlink").click(function(){
	$.when($(".stuff").fadeOut("slow")).done(function() {
		window.location.href = "/pages/about.html";
	});
})

var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.maxHeight){
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    } 
  });
}