var currStage = 1; // keeps track of the stage of the introduction the user is currently on 
const total_num_stages = 22; // defines total number of stages (= number of stage images)
let stageData = [];

// display stage 0 upon loading the html page 
document.addEventListener("DOMContentLoaded", function () {
    fetch("static/1_kernel_math_visualization_text.json")
        .then(response => response.json())
        .then(data => {
            stageData = data; // load json with text info for each stage
            showStage(); 
        });
});


function showStage() {
    // determine correct image path for current stage 
    let image_curr_stage = currStage + ".png";
    let path_image_curr_stage = "static/assets/1_vertical_visualization/" + image_curr_stage;

    console.log("trying to load: ", path_image_curr_stage); // testing purposes 

    // display corresponding image 
    drawImageOnCanvas(path_image_curr_stage);
}

function drawImageOnCanvas(imageSrc) {
    const canvas = document.getElementById("myCanvas");
    const ctx = canvas.getContext("2d");

    // Resize canvas to match container
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;

    const img = new Image();
    img.src = imageSrc;

    img.onload = function () {
        const cropMargin = 5; // Crop 1px from each side
        const cropX = cropMargin;
        const cropY = cropMargin;
        const cropWidth = img.width - cropMargin * 2;
        const cropHeight = img.height - cropMargin * 2;
    
        // Target size and position (95% of canvas, centered)
        const scaleFactor = 0.94;
        const targetWidth = canvas.width * scaleFactor;
        const targetHeight = canvas.height * scaleFactor;
        const x = (canvas.width - targetWidth) / 2;
        const y = (canvas.height - targetHeight) / 2;
    
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(
            img,
            cropX, cropY, cropWidth, cropHeight,
            x, y, targetWidth, targetHeight
        );
    };

    // Update left pane text
    const stage = stageData.find(item => item.stage === currStage);
    const leftPane = document.querySelector(".left50");
    leftPane.innerHTML = stage
        ? `<p>${stage.text}</p>`
        : `<p>No explanation found for this stage.</p>`;
}

function roundedRect(ctx, x, y, width, height, radius) {
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
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
        document.getElementById("nextButton").style.visibility = "visible";
    }
}

// TODO: outline stages here 
