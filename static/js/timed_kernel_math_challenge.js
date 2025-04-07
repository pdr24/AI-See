const challengeLevelLength = 60; // 60 for now 
let puzzles = []; // for storing all the puzzles
let currentPuzzle = null; // stores the current puzzle that has been selected
let startTime = null; 
let currPuzzleStartTime = null;

// for data collection 
let numCorrectAnswers = 0;
let numAnswers = 0;
let numPuzzlesCompleted = 0;

// indices of positions the students will be answering 
let i1 = null;
let j1 = null;
let i2 = null;
let j2 = null;

document.addEventListener("DOMContentLoaded", function () {
    startTime = Math.floor(Date.now() / 1000); // save start time 

    // Get the current value (or default to 0 if not set) and increment 
    let currPlayNumber = parseInt(localStorage.getItem('challenge_level_number')) || 0;
    currPlayNumber += 1;// Increment it
    localStorage.setItem('challenge_level_number', currPlayNumber); // Store the updated value back in localStorage

    // load puzzles
    fetch("static/timed_kernel_math_challenge.json")
        .then(response => response.json())
        .then(data => {
            puzzles = data;

            chooseRandomPuzzle();
            displayPuzzle(); 

            runChallengeLevel();
        })
        .catch(error => {
            console.error("Error loading puzzles:", error);
        });

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

            showTimeUpModal(); // show final accuracy and next/play again buttons 
        }
    }, 1000); // Update timer every second

    // Return a promise that resolves after the timer is done
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, secondsLeft * 1000); // Resolve the promise after the specified time
    });
}

function chooseRandomPuzzle() {
    // Choose a random puzzle
    const randomIndex = Math.floor(Math.random() * puzzles.length);
    currentPuzzle = puzzles[randomIndex];
}

// display the puzzle 
function displayPuzzle() {
    currPuzzleStartTime = Math.floor(Date.now() / 1000); // save start time of current puzzle 

    const puzzleTextElement = document.getElementById("puzzleText");

    const inputImageHTML = matrixToHTML(currentPuzzle.input_image, true);
    const kernelHTML = matrixToHTML(currentPuzzle.kernel, false);
    const questionHTML = matrixToHTML([["?", "?", "?"], ["?", "?", "?"], ["?", "?", "?"]], true);

    puzzleTextElement.innerHTML = `
        <p>Complete the feature map shown to the right, where the kernel below is applied on the input image below.</p>
        
        <div style="display: flex; gap: 5%; align-items: flex-start; margin: 5%">
            <div>
                <strong>Input Image:</strong><br>
                ${inputImageHTML}
            </div>
            <div>
                <p><br><b>*</b></p>
            </div>
            <div>
                <strong>Kernel:</strong><br>
                ${kernelHTML}
            </div>
            <div>
                <p><br><b>=</b></p>
            </div>
            <div>
                <strong>Feature Map:</strong><br>
                ${questionHTML}
            </div>
        </div>
        
    `;

    displayIncompleteFeatureMap(currentPuzzle.kernel, currentPuzzle.input_image);
}

function displayIncompleteFeatureMap(kernel, inputImage) {
    let completeFeatureMap = applyKernel(kernel, inputImage);

    // display the complete feature map 
    displayCompleteFeatureMap(completeFeatureMap);

    // Generate first random index
    i1 = Math.floor(Math.random() * 3);
    j1 = Math.floor(Math.random() * 3);

    do {
        i2 = Math.floor(Math.random() * 3);
        j2 = Math.floor(Math.random() * 3);
    } while (i2 === i1 && j2 === j1); // Regenerate only if identical to first    
    
    // replace these selected positions with input boxes
    unlockCell(i1, j1);
    unlockCell(i2, j2);
}

function displayCompleteFeatureMap(featureMap) {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const input = document.getElementById(`cell-${i}-${j}`);
            const td = input.parentElement;

            // Replace the input with a span showing the value
            const bgColor = colorMatrixValue(featureMap[i][j]);
            const textColor = "#00aff1";
            td.innerHTML = `
                <span id="cell-${i}-${j}" class="locked-cell" 
                    style="display: block; background-color: ${bgColor}; color: ${textColor}; border: 3px solid #00aff1; padding: 8px;">
                    ${featureMap[i][j]}
                </span>`;

        }
    }    
}

// allow user to input into a specific cell 
function unlockCell(i, j) {
    const cellId = `cell-${i}-${j}`;
    const span = document.getElementById(cellId);
    
    if (!span) {
        console.warn(`Cell ${cellId} not found or already unlocked.`);
        return;
    }

    const td = span.parentElement;

    td.innerHTML = `<input type="number" class="feature-map-input" id="${cellId}" 
                        oninput="updateInputColor(this)">`;
}

function updateInputColor(inputElement) {
    const value = parseInt(inputElement.value);
    const bgColor = colorMatrixValue(value);
    const textColor = "#00aff1";

    inputElement.style.backgroundColor = bgColor;
    inputElement.style.color = textColor;
}


function applyKernel(kernel, inputImage) {
    const output = [];

    for (let i = 0; i < 3; i++) { // output is always 3x3
        const row = [];
        for (let j = 0; j < 3; j++) {
            let sum = 0;
            for (let ki = 0; ki < 3; ki++) {
                for (let kj = 0; kj < 3; kj++) {
                    const inputVal = inputImage[i + ki][j + kj];
                    const kernelVal = kernel[ki][kj];
                    sum += inputVal * kernelVal;
                }
            }
            row.push(sum);
        }
        output.push(row);
    }

    console.table(output); // debugging purposes 
    return output;
}

function colorMatrixValue(val) {
    const colorMap = {
        0: "#FFFFFF",
        1: "#000000",
        2: "#262626",
        3: "#404040",
        4: "#595959",
        5: "#7f7f7f",
        6: "#a6a6a6",
        7: "#bfbfbf",
        8: "#d9d9d9",
        9: "#f2f2f2"
    };
    return colorMap[val] || "#FFFFFF"; // default to white if value is out of range
}

// helper function for displaying matrices nicely 
function matrixToHTML(matrix, shouldColor) {
    if (shouldColor) {
        return `<table class="matrix">` +
        matrix.map(row =>
            `<tr>` +
            row.map(val => {
                const bgColor = colorMatrixValue(val);
                const textColor = "#00aff1";
                return `<td style="border-color: #00aff1; background-color: ${bgColor}; color: ${textColor};">${val}</td>`;
            }).join("") +
            `</tr>`
        ).join("") +
        `</table>`;

    }
    else {
        return `<table class="matrix">` +
            matrix.map(row =>
                `<tr>` +
                row.map(val => `<td style="background-color: #c6e7ff;">${val}</td>`).join("") +
                `</tr>`
            ).join("") +
            `</table>`;

    }
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

function testSingleCellAccuracy(i, j) {
    // get the user's input 
    let cellId = `cell-${i}-${j}`;
    let input = document.getElementById(cellId);
    let userAnswer = parseInt(input.value); 

    const featureMap = applyKernel(currentPuzzle.kernel, currentPuzzle.input_image);

    // update vars based on correctness 
    numAnswers = numAnswers + 1;
    if (userAnswer === featureMap[i][j]) {
        numCorrectAnswers = numCorrectAnswers + 1;
        return 1; // indicates correct answer
    }        
    else {
        return 0; // indicates incorrect answer 
    }

}

function showNextPuzzle() {
    // check for any blank inputs
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const inputId = `cell-${i}-${j}`;
            const inputElement = document.getElementById(inputId);
            if (!inputElement) continue;

            if (inputElement.tagName === "INPUT" && inputElement.value.trim() === "") {
                alert("Please completely fill in the feature map on the right before testing your accuracy.");
                return; // Stop execution if any input is blank
            }
        }
    }

    testAccuracy();

    chooseRandomPuzzle();
    displayPuzzle();
}

function testAccuracy() {

    let currPuzzleTimeSpent = Math.floor(Date.now() / 1000) - currPuzzleStartTime;

    let accuracy1 = testSingleCellAccuracy(i1, j1);
    let accuracy2 = testSingleCellAccuracy(i2, j2);
    let tempAccuracy = 1.0 * (accuracy1 + accuracy2) / 2.0 * 100;

    let correctMap = applyKernel(currentPuzzle.kernel, currentPuzzle.input_image);
    let currChallengeLevelCounter = parseInt(localStorage.getItem('challenge_level_number'));

    // get user inputs for the two cells they are filling out 
    let userAnswer = [[-1, -1, -1], [-1, -1, -1], [-1, -1, -1]];
    userAnswer[i1][j1] = getOneCellUserEntry(i1, j1);
    userAnswer[i2][j2] = getOneCellUserEntry(i2, j2);

    collectKernelMathPuzzleData(currPuzzleTimeSpent, currentPuzzle.input_image, currentPuzzle.kernel, correctMap, userAnswer, tempAccuracy, currChallengeLevelCounter);

    numPuzzlesCompleted = numPuzzlesCompleted + 1;
}

function getOneCellUserEntry(i, j) {
    // get the user's input 
    let cellId = `cell-${i}-${j}`;
    let input = document.getElementById(cellId);
    let userAnswer = parseInt(input.value); 

    // return user's input 
    return userAnswer;
}

function showTimeUpModal() {
    // calculate and display accuracy 
    let accuracy = null;
    if (numAnswers == 0) {
        accuracy = 0;
    }
    else {
        accuracy = numCorrectAnswers / (1.0 * numAnswers) * 100;
    }
    let finalScore = accuracy * numPuzzlesCompleted;

    // show accuracy div 
    let container = document.getElementById("container");
    container.innerHTML = `
        <div class="accuracy-display-container" style="height: 35vh;">  
            <div>  
                <p class="accuracy-display-text">Accuracy: ${accuracy}% <br><br> Number of Puzzles Completed: ${numPuzzlesCompleted}</p>
                <p class="accuracy-display-text"><b>Final Score: ${finalScore}</b></p>

                <div class="buttonRow">
                    <button class="playAgainButton" onclick="playAgain()">Play Again</button>
                    <button class="nextButton" onclick="redirectToNextLevel()">Next</button>
                </div>
            <div>
        </div>
    `;

    // remove test accuracy button 
    let testAccuracyButton = document.getElementById("testAccuracyButton");
    testAccuracyButton.style.visibility = "hidden";
}
