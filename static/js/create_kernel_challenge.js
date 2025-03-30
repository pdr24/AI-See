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

    const inputImageHTML = matrixToHTML(currentPuzzle.input_image);
    const featureMapHTML = matrixToHTML(currentPuzzle.answer_feature_map);
    const puzzleInstructions = currentPuzzle.instructions;

    puzzleTextElement.innerHTML = `
        <p>${puzzleInstructions}</p>
        <strong>Input Image:</strong><br>${inputImageHTML}<br>
        <strong>Kernel:</strong><br>${featureMapHTML}<br>
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
    // determine output map user's kernel would create on the input image 
    let inputImage = currentPuzzle.input_image;
    let correctFeatureMap = currentPuzzle.answer_feature_map;
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
    console.log("User accuacy: ", accuracy);
    alert(`Accuracy: ${accuracy}%`); // temporary accuracy display method 
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

