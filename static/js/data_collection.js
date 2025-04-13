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

// collect time spent on a specific stage of the kernel math intro page 
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

// collect data on specific kernel math puzzle 
function collectKernelMathPuzzleData(timeSpent, inputImage, kernel, expectedAnswer, userAnswer, accuracy, isChallengeLevel) {
    // data object to store 
    const data = {
        timeSpent : timeSpent,
        isChallengeLevel : isChallengeLevel,
        accuracy : accuracy,
        inputImage : inputImage,
        kernel: kernel,
        expectedAnswer : expectedAnswer,
        userAnswer : userAnswer
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
    if (!userData.kernel_math_puzzles) {
        userData.kernel_math_puzzles = [];
    }

    // push puzzle data to userData puzzles array  
    userData.kernel_math_puzzles.push(data);

    // Save updated data back to local storage
    localStorage.setItem(userKey, JSON.stringify(userData));

    // new addition
    localStorage.setItem('mainkey', JSON.stringify(userKey));
}

 // collect overall data for a timed challenge kernel math level play 
function collectKernelMathChallengeData(numPlay, finalAccuracy, numPuzzles, score) {
    // data object to store 
    const data = {
        numPlay : numPlay,
        finalOverallAccuracy : finalAccuracy,
        numPuzzles : numPuzzles,
        score : score
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
    if (!userData.timed_kernel_math_challenge_overall) {
        userData.timed_kernel_math_challenge_overall = [];
    }

    // push puzzle data to userData puzzles array  
    userData.timed_kernel_math_challenge_overall.push(data);

    // Save updated data back to local storage
    localStorage.setItem(userKey, JSON.stringify(userData));

    // new addition
    localStorage.setItem('mainkey', JSON.stringify(userKey));
}

function collectCreateKernelData(timeSpent, accuracy, inputImage, exampleFeatureMap, userAnswer, expectedAnswer, userOutputFeatureMap) {
    // data object to store 
    const data = {
        timeSpent : timeSpent,
        accuracy : accuracy,
        inputImage : inputImage,
        exampleFeatureMap : exampleFeatureMap,
        userOutputFeatureMap : userOutputFeatureMap,
        expectedKernelAnswer : expectedAnswer,
        userKernelAnswer : userAnswer
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
    if (!userData.create_kernel_puzzles) {
        userData.create_kernel_puzzles = [];
    }

    // push puzzle data to userData puzzles array  
    userData.create_kernel_puzzles.push(data);

    // Save updated data back to local storage
    localStorage.setItem(userKey, JSON.stringify(userData));

    // new addition
    localStorage.setItem('mainkey', JSON.stringify(userKey));
}


// save user data to computer and clear local storage 
function saveUserDataToComputer() {

    let logoutTime = Math.floor(Date.now() / 1000) // current time in seconds (time since 1970)  
    localStorage.setItem('logout_time', logoutTime); // set logout time

    console.log("entered saveUserDataToComputer()"); 

    let allUserData = {};

    // Generate the timestamp
    let date = new Date();
    let timestamp = `${date.getFullYear() % 100}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}_${date.getHours().toString().padStart(2, '0')}-${date.getMinutes().toString().padStart(2, '0')}-${date.getSeconds().toString().padStart(2, '0')}`;
    
    if (localStorage.length > 0) {
        // Use the last key in local storage for the filename
        let lastKey = localStorage.key(localStorage.length - 1);
        let mainKey = JSON.parse(localStorage.getItem('mainkey'));

        for (let i = 0; i < localStorage.length; i++) {
            let key = localStorage.key(i);
            let value = localStorage.getItem(key);
            try {
                allUserData[key] = JSON.parse(value);
            } catch (e) {
                console.warn(`Skipping key ${key} due to invalid JSON: ${value}`);
            }
        }
    
        let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(allUserData, null, 2));
        let downloadAnchorNode = document.createElement('a');
        let filename = `${mainKey}_${timestamp}.json`;
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", filename);
        document.body.appendChild(downloadAnchorNode); // Required for Firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    
        // Clear local storage
        localStorage.clear();
    } else {
        console.warn('No data in local storage to download.');
    }
    
}

function masterLogout() {
    const password = prompt("Enter the master password to log out:");

    if (password === "master") {
        logMasterLogout();
        logout();
    } else {
        alert("Please keep playing the game");
    }
}

function logMasterLogout() {
    // get user key 
    var userKey = getUserKey();

    // Retrieve existing data for this user
    let userData = localStorage.getItem(userKey);
    if (userData) {
        userData = JSON.parse(userData);
    } else {
        userData = {};
    }

    // log that master logout was detected 
    userData.masterLogout = true;

    // Save updated data back to local storage
    localStorage.setItem(userKey, JSON.stringify(userData));

    // new addition
    localStorage.setItem('mainkey', JSON.stringify(userKey));
}