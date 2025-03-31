let puzzles = []; // for storing all the puzzles
let currentPuzzle = null; // stores the current puzzle that has been selected

// load and display a puzzle when the html page loads
document.addEventListener("DOMContentLoaded", function () {

    fetch("static/kernel_math_puzzles.json")
        .then(response => response.json())
        .then(data => {
            puzzles = data;

            chooseRandomPuzzle();
            displayPuzzle(); 
        })
        .catch(error => {
            console.error("Error loading puzzles:", error);
        });

});

// choose one of the puzzles at random 
function chooseRandomPuzzle() {
    // Choose a random puzzle
    const randomIndex = Math.floor(Math.random() * puzzles.length);
    currentPuzzle = puzzles[randomIndex];
}

// display the puzzle 
function displayPuzzle() {
    const puzzleTextElement = document.getElementById("puzzleText");

    if (!currentPuzzle) {
        puzzleTextElement.innerHTML = "<p>No puzzle found.</p>";
        return;
    }

    const inputImageHTML = matrixToHTML(currentPuzzle.inputImage);
    const kernelHTML = matrixToHTML(currentPuzzle.kernel);

    puzzleTextElement.innerHTML = `
    <p>Calculate the feature map the computer would get when applying this kernel on this input image:</p>
    <div style="display: flex; gap: 15%; align-items: flex-start; margin: 5%">
        <div>
            <strong>Input Image:</strong><br>
            ${inputImageHTML}
        </div>
        <div>
            <strong>Kernel:</strong><br>
            ${kernelHTML}
        </div>
    </div>
`;

}

// helper function for displaying matrices nicely 
function matrixToHTML(matrix) {
    return `<table class="matrix">` +
        matrix.map(row =>
            `<tr>${row.map(val => `<td>${val}</td>`).join("")}</tr>`
        ).join("") +
        `</table>`;
}

function testAccuracy() {
    // TODO: prompt user to complete the puzzle if any input fields are blank 

    // calculate user's accuracy 
    const correctMap = currentPuzzle.feature_map;
    let total = 9; // number of input boxes user must fill out is hard coded at 9 for now 
    let correct = 0;

    // count number of correct entries 
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const inputId = `cell-${i}-${j}`;
            const inputElement = document.getElementById(inputId);
            if (!inputElement) continue;

            const userValue = parseInt(inputElement.value);
            const correctValue = correctMap[i][j];

            if (!isNaN(userValue) && (userValue === correctValue)) {
                correct++;
            }
        }
    }

    const accuracy = Math.round((correct / total) * 100); // calculate accuracy 

    // show accuracy div 
    let leftContainer = document.getElementById("leftContainer");
    leftContainer.innerHTML = `
        <div class="accuracy-display-container">    
            <p class="accuracy-display-text">Accuracy: ${accuracy}%</p>
            
            <button class="nextButton" onclick="redirectToNextLevel()">Next</button>
        </div>
    `;

    // remove test accuracy button 
    let testAccuracyButton = document.getElementById("testAccuracyButton");
    testAccuracyButton.style.visibility = "hidden";
}

function displayAccuracy() {
    // TODO: display user's accuracy 
}

function displayNextButton() {
    // TODO: display the next button for the user to move to the next level 
}