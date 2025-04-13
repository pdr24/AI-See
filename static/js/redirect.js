const pageIdList = ["login", "cnn_introduction", "feature_map_introduction", "feature_map_match_level", "kernel_math_introduction", "kernel_math_level", "timed_challenge_intro", "timed_kernel_math_challenge_level", "create_kernel_challenge_level", "postsurvey"];
const pageHTMLList = ["index.html", "introduction.html", "feature_map_intro.html", "feature_map_match_level.html", "kernel_math_intro.html", "kernel_math_level.html", "timed_challenge_intro.html", "timed_kernel_math_challenge.html", "create_kernel_challenge.html", "postsurvey_link.html"];

let currentPageId = null;
let nextLevelId = null;
let nextLevelHTML = null;
let currIndex = null;
let nextLevelIndex = null;

document.addEventListener("DOMContentLoaded", function () {

    const pageBody = document.body;
    const currentPageId = pageBody.getAttribute('data-page-id');  // Get the current html page's id 

    currIndex = pageIdList.indexOf(currentPageId); // get index of page id 
    nextLevelIndex = currIndex + 1;

    if (currIndex == (pageIdList.length - 1)) {
        // redirect back to login page 
        nextLevelIndex = 0
        nextLevelId = pageIdList[nextLevelIndex]; 
        nextLevelHTML = pageHTMLList[nextLevelIndex]; 
    }

    nextLevelId = pageIdList[nextLevelIndex]; // get id of next page
    nextLevelHTML = pageHTMLList[nextLevelIndex]; // get html filename of next page 

});

function redirectToNextLevel() {
    window.location.href = "/AI-See/" + nextLevelHTML; // needed for deployment from github pages 
    // window.location.href = nextLevelHTML;
}

function next() {
    // get html page id 
    let pageID = document.body.getAttribute("data-page-id");

    collectTimeOnLevel(startTime, pageID); // save time spent on page
    
    redirectToNextLevel(); // redirect to the next level 
}

function playAgain() {
    window.location.reload(); 
}

function playAgainTimedChallenge() {
    window.location.href = "timed_challenge_intro.html";
}