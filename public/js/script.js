//  typed js effect starts 
document.addEventListener("DOMContentLoaded", function() {
    var options = {
        strings: ["Youtube", "Facebook", "Instagram", "Telegram"],
        typeSpeed: 50,
        backSpeed: 25,
        backDelay: 500,
        loop: true
    };

    var typing = new Typed(".typing-text", options);
});


const toggleButton = document.getElementById("nav-toggle");
const navLinks = document.getElementById("nav-links");

toggleButton.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});


function showSidebar(){
  const sidebar=document.querySelector('.sidebar')
  sidebar.style.display='flex';
}
function hideSidebar(){
  const sidebar= document.querySelector('.sidebar')
  sidebar.style.display='none';
}