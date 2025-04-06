let puzzles = []; // for storing all the puzzles
let currentPuzzle = null; // stores the current puzzle that has been selected

// load and display a puzzle when the html page loads
document.addEventListener("DOMContentLoaded", function () {

    fetch("static/create_kernel_challenge_puzzles.json")
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

function displayPuzzle() {
    const puzzleTextElement = document.getElementById("puzzleText");

    if (!currentPuzzle) {
        puzzleTextElement.innerHTML = "<p>No puzzle found.</p>";
        return;
    }

    const inputImageHTML = matrixToHTML(currentPuzzle.input_image, true);
    const featureMapHTML = matrixToHTML(applyKernel(currentPuzzle.answer_kernel, currentPuzzle.input_image), true);
    const puzzleInstructions = currentPuzzle.instructions;

    puzzleTextElement.innerHTML = `
        <div>    
            <p style="font-size: 80%">${puzzleInstructions}</p>
            <div style="display: flex; gap: 15%; align-items: flex-start; margin: 5%">
                <div>
                    <strong>Input Image:</strong><br>
                    ${inputImageHTML}
                </div>
                <div>
                    <strong>Feature Map:</strong><br>
                    ${featureMapHTML}
                </div>
            </div>
        </div>
    `;

}


function setupInputColoring() {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const input = document.getElementById(`cell-${i}-${j}`);
            if (!input) continue;

            input.addEventListener("input", () => {
                const val = parseInt(input.value);
                const bgColor = colorMatrixValue(val);
                const textColor = "#00aff1";
                input.style.backgroundColor = bgColor;
                input.style.color = textColor;
            });
        }
    }
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


function testAccuracy() {
    // determine output map user's kernel would create on the input image 
    let inputImage = currentPuzzle.input_image;
    let correctFeatureMap = applyKernel(currentPuzzle.answer_kernel, inputImage);
    let userKernel = readUserInputKernel();
    let userOutputFeatureMap = applyKernel(userKernel, inputImage);

    // check user generated kernel's feature map against answer feature map
    let correctCellCount = 0;
    for (let i = 0; i < 3; i++) { // output is always 3x3
        for (let j = 0; j < 3; j++) {
            if (userOutputFeatureMap[i][j] === correctFeatureMap[i][j]) {
                correctCellCount = correctCellCount + 1;
            }
        }
    }

    let accuracy = (correctCellCount / 9.0) * 100;

    // show accuracy div 
    let container = document.getElementById("leftContainer");
    container.innerHTML = `
        <div class="accuracy-display-container" ">    
            <p class="accuracy-display-text">Accuracy: ${accuracy}% <br><br>You've reached the end. Play this level again or log out below</p>
            
            <div class="buttonRow">
                <button class="playAgainButton" onclick="playAgain()">Play Again</button>
                <button class="nextButton" onclick="redirectToNextLevel()">Log Out</button>
            </div>
        </div>
    `;

    // remove test accuracy button 
    let testAccuracyButton = document.getElementById("testAccuracyButton");
    testAccuracyButton.style.visibility = "hidden";

    return accuracy;
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

function readUserInputKernel() {
    const matrix = [];

    for (let i = 0; i < 3; i++) {
        const row = [];
        for (let j = 0; j < 3; j++) {
            const input = document.getElementById(`cell-${i}-${j}`);
            const value = parseInt(input.value);

            // If empty or invalid, treat as 0 (or you can throw an error)
            row.push(isNaN(value) ? 0 : value);
        }
        matrix.push(row);
    }

    return matrix;
}

