const challengeLevelLength = 30; // 30 for now 

document.addEventListener("DOMContentLoaded", function () {

    runChallengeLevel();

});


function runChallengeLevel() {
    // create timer element to display the timer 
    makeTimer();
    let secondsLeft = challengeLevelLength; // number of seconds to start the timer at 
    updateTimerDisplay(secondsLeft);

    var timerInterval = setInterval(function() {
        secondsLeft--; // Decrement the time
        updateTimerDisplay(secondsLeft); // Update the timer display

        if (secondsLeft <= 0) {
            clearInterval(timerInterval); // Stop the timer when time is up
        }
    }, 1000); // Update timer every second

    // Return a promise that resolves after the timer is done
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, secondsLeft * 1000); // Resolve the promise after the specified time
    });
}

// create timer div for the challenge level 
function makeTimer() {
    // Display timer element
    var timerElement = document.createElement('div');
    timerElement.id = 'timer';
    timerElement.style.position = 'absolute';
    timerElement.style.left = '8%';
    timerElement.style.top = '3%';
    timerElement.style.fontSize = '2vh';
    timerElement.style.fontFamily = 'DynaPuff';
    timerElement.style.color = 'white';

    // Add outline and background color
    timerElement.style.border = '2px solid black'; 
    timerElement.style.backgroundColor = 'rgba(0, 0, 0, 0.9)'; 
    timerElement.style.borderRadius = '50%'; // Make the border radius 50% to create a circle

    // Set width and height to ensure it's a circle
    timerElement.style.width = '8vh'; // Adjust the width of the circle as needed
    timerElement.style.height = '8vh'; // Adjust the height of the circle as needed

    // Center the text vertically and horizontally
    timerElement.style.display = 'flex';
    timerElement.style.alignItems = 'center';
    timerElement.style.justifyContent = 'center';

    // Append the timer element to the document body
    document.body.appendChild(timerElement);
}

// update timer 
function updateTimerDisplay(seconds) {
    var timerElement = document.getElementById('timer');
    if (timerElement) {
        timerElement.innerText = seconds + 's';
    }
}