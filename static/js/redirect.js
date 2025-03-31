const pageIdList = ["login", "cnn_introduction", "feature_map_introduction", "feature_map_match_level", "kernel_math_introduction", "kernel_math_level", "timed_kernel_math_challenge_level", "create_kernel_challenge_level"];
const pageHTMLList = ["index.html", "introduction.html", "feature_map_intro.html", "feature_map_match_level.html", "kernel_math_intro.html", "kernel_math_level.html", "timed_kernel_math_challenge.html", "create_kernel_challenge.html"];

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

    nextLevelId = pageIdList[nextLevelIndex]; // get id of next page
    nextLevelHTML = pageHTMLList[nextLevelIndex]; // get html filename of next page 

});

function redirectToNextLevel() {
    window.location.href = "../../" + nextLevelHTML;
}

function playAgain() {
    window.location.reload(); 
}

//TODO: maybe add logout functionality from the very last page or something like that 