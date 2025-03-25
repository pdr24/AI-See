var currStage = 0; // keeps track of the stage of the introduction the user is currently on 

function showStage() {
    // TODO: show the visualization and explanation for current stage 

}

function nextStage() {
    console.log("Next Stage button has been clicked");

    // update current stage tracker 
    currStage = currStage + 1;

    // show next stage
    showStage(); 
}

function prevStage() {
    console.log("Previous Stage button has been clicked");

    // update current stage tracker 
    currStage = currStage - 1;

    // show prev stage 
    showStage();
}

// TODO: outline stages here 
