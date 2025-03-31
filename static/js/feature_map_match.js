document.addEventListener("DOMContentLoaded", function () {
    const features = document.querySelectorAll(".feature"); // Draggable feature map images
    const kernels = document.querySelectorAll(".dropzone"); // Dropzones (kernels)

    // Store correct matches
    const correctMatches = {
        "feature1": "drop1",
        "feature2": "drop2",
        "feature3": "drop3",
        "feature4": "drop4"
    };

    let userMatches = {}; // Store user's answers

    // Add drag events to feature maps
    features.forEach(feature => {
        feature.addEventListener("dragstart", (event) => {
            event.dataTransfer.setData("text/plain", event.target.id);
        });
    });

    // Add drop events to kernel drop zones
    kernels.forEach(kernel => {
        kernel.addEventListener("dragover", (event) => {
            event.preventDefault(); // Allow dropping
            kernel.classList.add("dragover");
        });

        kernel.addEventListener("dragleave", () => {
            kernel.classList.remove("dragover");
        });

        kernel.addEventListener("drop", (event) => {
            event.preventDefault();
            kernel.classList.remove("dragover");

            const draggedFeatureId = event.dataTransfer.getData("text/plain");
            const droppedKernelId = event.target.id;

            // Remove previous feature map if already dropped
            if (kernel.children.length > 0) {
                kernel.removeChild(kernel.firstChild);
            }

            // Append feature map inside the drop zone
            const draggedFeature = document.getElementById(draggedFeatureId);
            kernel.appendChild(draggedFeature);

            // Store user match
            userMatches[draggedFeatureId] = droppedKernelId;
        });
    });

    // Test accuracy function
    document.getElementById("testAccuracyButton").addEventListener("click", function () {
        let correctCount = 0;
        let totalMatches = Object.keys(correctMatches).length;

        for (let feature in correctMatches) {
            if (correctMatches[feature] === userMatches[feature]) {
                correctCount++;
            }
        }

        let accuracy = 1.0 * correctCount / totalMatches * 100;

        // show accuracy div 
        let leftContainer = document.getElementById("leftContainer");
        leftContainer.innerHTML = `
            <div class="accuracy-display-container">    
                <p class="accuracy-display-text">Accuracy: ${accuracy}% <br><br>${correctCount} / ${totalMatches} correct matches!</p>
                
                <button class="nextButton" onclick="redirectToNextLevel()">Next</button>
            </div>
        `;

        // remove test accuracy button 
        let testAccuracyButton = document.getElementById("testAccuracyButton");
        testAccuracyButton.style.visibility = "hidden";

    });
});
