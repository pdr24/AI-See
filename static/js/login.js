// check if login inputs were valid 
function validateForm() {
    console.log("login was clicked")
    var input1 = document.getElementById("input1").value;
    var input2 = document.getElementById("input2").value;
    var input3 = document.getElementById("input3").value;
    if (input1.trim() === '' || input2.trim() === '' || input3.trim() === '') {
      alert("Please fill in all three fields.");
      return false;
    }

    // save current user's info to local storage
    addUser(input1, input2, input3);

    redirectToNextLevel();
    
    return false; // Prevent form submission
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

// UI purposes 
function changeFontColor(id) {
    const el = document.getElementById(id);
    el.style.color = "black";
  }