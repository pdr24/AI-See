let puzzles = []; // for storing all the puzzles
let currentPuzzle = null; // stores the current puzzle that has been selected
let startTime = null; 

// load and display a puzzle when the html page loads
document.addEventListener("DOMContentLoaded", function () {
    startTime = Math.floor(Date.now() / 1000); // save start time 

    fetch("static/kernel_math_puzzles.json")
        .then(response => response.json())
        .then(data => {
            puzzles = data;

            chooseRandomPuzzle();
            displayPuzzle(); 
            createSlidingKernelOverlay();

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

    const inputImageHTML = matrixToHTML(currentPuzzle.input_image, true);
    const kernelHTML = matrixToHTML(currentPuzzle.kernel, false);
    const questionHTML = matrixToHTML([["?", "?", "?"], ["?", "?", "?"], ["?", "?", "?"]], true);

    puzzleTextElement.innerHTML = `
        <p>Calculate the feature map the computer would get when applying this kernel on this input image:</p>
        <div style="display: flex; gap: 5%; align-items: flex-start; margin: 5%">
            <div class="input-wrapper" style="position: relative; display: inline-block;">
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

    setupInputColoring(); // color cells as user enters input 

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


function testAccuracy() {
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

    // calculate user's accuracy 
    const correctMap = applyKernel(currentPuzzle.kernel, currentPuzzle.input_image);
    let total = 9; // number of input boxes user must fill out is hard coded at 9 for now 
    let correct = 0;
    let userMap = [[-1, -1, -1], [-1, -1, -1], [-1, -1, -1]];

    // count number of correct entries 
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const inputId = `cell-${i}-${j}`;
            const inputElement = document.getElementById(inputId);
            if (!inputElement) continue;

            const userValue = parseInt(inputElement.value);
            userMap[i][j] = userValue;

            const correctValue = correctMap[i][j];

            if (!isNaN(userValue) && (userValue === correctValue)) {
                correct++;
            }
        }
    }

    const accuracy = Math.round((correct / total) * 100); // calculate accuracy 

    // save puzzle data 
    let timeSpent = Math.floor(Date.now() / 1000) - startTime;
    collectKernelMathPuzzleData(timeSpent, currentPuzzle.input_image, currentPuzzle.kernel, correctMap, userMap, accuracy, false);

    // show accuracy div 
    let leftContainer = document.getElementById("leftContainer");
    leftContainer.innerHTML = `
        <div class="accuracy-display-container">    
            <p class="accuracy-display-text">Accuracy: ${accuracy}%</p>
            
            <div class="buttonRow">
                <button class="playAgainButton" onclick="playAgain()">Play Again</button>
                <button class="nextButton" onclick="redirectToNextLevel()">Next</button>
            </div>
        </div>
    `;

    // remove test accuracy button 
    let testAccuracyButton = document.getElementById("testAccuracyButton");
    testAccuracyButton.style.visibility = "hidden";
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

// sliding kernel 
function createSlidingKernelOverlay() {
    const wrapper = document.querySelector(".input-wrapper");
    if (!wrapper) return;

    const overlay = document.createElement("div");
    overlay.id = "slidingKernel";
    overlay.style.position = "absolute";

    overlay.style.width = "55%";  
    overlay.style.height = "51%";

    overlay.style.backgroundColor = "rgba(0, 175, 241, 0.3)";
    overlay.style.border = "2px dashed #00aff1";
    overlay.style.cursor = "grab";
    overlay.style.zIndex = "10";
    overlay.draggable = false; // don't let browser drag it
    wrapper.appendChild(overlay);

    makeOverlayDraggable(overlay, wrapper);
}

function makeOverlayDraggable(overlay, wrapper) {
    const cellSize = 25; 
    const maxRow = 4; 
    const maxCol = 3;

    let offsetX, offsetY;
    let isDragging = false;

    overlay.addEventListener("mousedown", (e) => {
        isDragging = true;
        offsetX = e.offsetX;
        offsetY = e.offsetY;
        overlay.style.cursor = "grabbing";
    });

    document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;

        const wrapperRect = wrapper.getBoundingClientRect();
        let x = e.clientX - wrapperRect.left - offsetX;
        let y = e.clientY - wrapperRect.top - offsetY;

        // Snap to nearest cell 
        x = Math.round(x / cellSize) * cellSize;
        y = Math.round(y / cellSize) * cellSize;

        // Clamp within bounds (max top-left corner is at cell 4,4)
        x = Math.min(x, maxCol * cellSize);
        y = Math.min(y, maxRow * cellSize);
        x = Math.max(x, 0);
        y = Math.max(y, 0);

        overlay.style.left = x + "px";
        overlay.style.top = y + "px";
    });

    document.addEventListener("mouseup", () => {
        if (isDragging) {
            isDragging = false;
            overlay.style.cursor = "grab";
        }
    });
}