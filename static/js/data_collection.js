// TODO: implement data collection here 

// get user key for the current user based on user info 
function getUserKey() {
    let userInfo = JSON.parse(localStorage.getItem('userinfo'));
    let firstName = userInfo.fname;
    let lastInitial = userInfo.linitial;
    let gradeLevel = userInfo.gradelevel;
    let loginTime = userInfo.logintime;

    var key = `${firstName}_${lastInitial}_${gradeLevel}_${loginTime}`;
    console.log('key is ' + key); // testing purposes 

    return key;
}

// Add new users to locally stored JSON object
function addUser(firstName, lastInitial, gradeLevel) {
    user_identifying_info = {
        fname : firstName,
        linitial : lastInitial,
        gradelevel : gradeLevel,
        logintime : Math.floor(Date.now() / 1000) // current time in seconds (time since 1970)
    }

    localStorage.setItem('userinfo', JSON.stringify(user_identifying_info));

    // set timed challenge level number to 1 for later use 
    localStorage.setItem('timed_challenge_level_number', 1);
}

function collectTimeOnLevel(startTime, pageID) {
    // Calculate time spent on level
    const timeSpent = Math.floor(Date.now() / 1000) - startTime;

    // Get user key
    const userKey = getUserKey();

    // Retrieve existing data for this user
    let userData = localStorage.getItem(userKey);
    userData = userData ? JSON.parse(userData) : {};

    // Ensure time_spent_on_pages is an object
    if (typeof userData['time_spent_on_pages'] !== 'object' || Array.isArray(userData['time_spent_on_pages'])) {
        userData['time_spent_on_pages'] = {};
    }

    // Add or update time for this page
    userData['time_spent_on_pages'][pageID] = timeSpent;

    // Save updated data back to localStorage
    localStorage.setItem(userKey, JSON.stringify(userData));

    localStorage.setItem('mainkey', userKey);
}


function collectFeatureMapMatchData() {

}

function collectKernelMathData() {

}

function collectKernelMathChallengeData() {

}

function collectCreateKernelData() {

}

function collectUserLoginData() {
    
}

function saveToLocalStorage() {

}

function downloadFromLocalStorage() {

}

// TODO: think about how all the data will be stored/organized in a json file for each user 