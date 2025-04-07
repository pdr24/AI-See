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

// collect data on a feature map make-a-match puzzle 
function collectFeatureMapMatchData(accuracy, timeSpent, isVerticalCorrect, isHorizontalCorrect, isUpwardCorrect, isDownwardCorrect, numResetClicks) {
    const data = {
            timeSpent : timeSpent,
            accuracy : accuracy,
            isVerticalCorrect : isVerticalCorrect,
            isHorizontalCorrect : isHorizontalCorrect,
            isUpwardCorrect : isUpwardCorrect,
            isDownwardCorrect : isDownwardCorrect,
            numResetClicks : numResetClicks
        }

    // get user key 
    var userKey = getUserKey();

    // Retrieve existing data for this user
    let userData = localStorage.getItem(userKey);
    if (userData) {
        userData = JSON.parse(userData);
    } else {
        userData = {};
    }

    // Initialize puzzles array if it doesn't exist in userData 
    if (!userData.feature_map_match_puzzles) {
        userData.feature_map_match_puzzles = [];
    }

    // push puzzle data to userData puzzles array  
    userData.feature_map_match_puzzles.push(data);

    // Save updated data back to local storage
    localStorage.setItem(userKey, JSON.stringify(userData));

    // new addition
    localStorage.setItem('mainkey', JSON.stringify(userKey));

}

function collectStageDataKernelMathVisualization(startTime, currStage) {
    // Calculate time spent on the current stage 
    const timeSpent = Math.floor(Date.now() / 1000) - startTime;

    // Get user key
    const userKey = getUserKey();

    // Retrieve existing data for this user
    let userData = localStorage.getItem(userKey);
    userData = userData ? JSON.parse(userData) : {};

    // Ensure the container is an object
    if (typeof userData['kernel_math_visualization_stage_time_spent'] !== 'object' || Array.isArray(userData['kernel_math_visualization_stage_time_spent'])) {
        userData['kernel_math_visualization_stage_time_spent'] = {};
    }

    // Ensure the stage is initialized as an array
    if (!Array.isArray(userData['kernel_math_visualization_stage_time_spent'][currStage])) {
        userData['kernel_math_visualization_stage_time_spent'][currStage] = [];
    }

    // Push this session's time to the array
    userData['kernel_math_visualization_stage_time_spent'][currStage].push(timeSpent);

    // Save updated data back to localStorage
    localStorage.setItem(userKey, JSON.stringify(userData));

    // Also store main key for reference
    localStorage.setItem('mainkey', userKey);
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