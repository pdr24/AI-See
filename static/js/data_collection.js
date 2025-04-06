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

function collectTimeOnLevel() {

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