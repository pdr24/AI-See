let puzzles = [];
let currentPuzzle = null;

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
        <p>Calculate the feature map the computer would get when applying this kernel on this input image.</p>
        <strong>Input Image:</strong><br>${inputImageHTML}<br>
        <strong>Kernel:</strong><br>${kernelHTML}<br>
        
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


