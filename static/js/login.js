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

    // redirect to next page upon successful login 
    redirectToNextLevel();

    return false; // Prevent form submission
}

// UI purposes 
function changeFontColor(id) {
    const el = document.getElementById(id);
    el.style.color = "black";
  }