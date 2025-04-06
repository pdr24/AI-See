let startTime = null;

document.addEventListener("DOMContentLoaded", function () {

    startTime = Math.floor(Date.now() / 1000); // save start time 

});

function next() {
    // get html page id 
    let pageID = document.body.getAttribute("data-page-id");

    collectTimeOnLevel(startTime, pageID); // save time spent on page
    
    redirectToNextLevel(); // redirect to the next level 
}