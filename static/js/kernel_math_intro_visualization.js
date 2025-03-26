var currStage = 1; // keeps track of the stage of the introduction the user is currently on 
const total_num_stages = 22; // defines total number of stages (= number of stage images)
let stageData = [];

// display stage 0 upon loading the html page 
document.addEventListener("DOMContentLoaded", function () {
    fetch("static/kernel_math_visualization_stages_text.json")
        .then(response => response.json())
        .then(data => {
            stageData = data; // load json with text info for each stage
            showStage(); 
        });
});


function showStage() {
    // determine correct image path for current stage 
    let image_curr_stage = currStage + ".png";
    let path_image_curr_stage = "static/assets/kernel_math_visualization_stages/" + image_curr_stage;

    console.log("trying to load: ", path_image_curr_stage); // testing purposes 

    // display corresponding image 
    drawImageOnCanvas(path_image_curr_stage);

    // TODO: show text for current stage 

}

function drawImageOnCanvas(imageSrc) {
    const canvas = document.getElementById("myCanvas");
    const ctx = canvas.getContext("2d");

    // Resize canvas to match its container
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;

    const img = new Image();
    img.src = imageSrc;

    img.onload = function () {
        // Draw image centered on the canvas
        const x = (canvas.width - img.width) / 2;
        const y = (canvas.height - img.height) / 2;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, x, y);
    };

    // Get the text from the loaded JSON
    const stage = stageData.find(item => item.stage === currStage);
    const leftPane = document.querySelector(".left50");

    if (stage) {
        leftPane.innerHTML = `<p>${stage.text}</p>`;
    } else {
        leftPane.innerHTML = `<p>No explanation found for this stage.</p>`;
    }
}


function nextStage() {
    console.log("Next Stage button has been clicked");

    // update current stage tracker 
    currStage = currStage + 1;
    check_curr_stage_reset();

    // show next stage
    showStage(); 
}

function prevStage() {
    console.log("Previous Stage button has been clicked");

    // update current stage tracker 
    currStage = currStage - 1;
    check_curr_stage_reset();

    // show prev stage 
    showStage();
}

function check_curr_stage_reset() {
    if (currStage > total_num_stages) {
        currStage = 1;
    }
}

// TODO: outline stages here 
