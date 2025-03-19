document.addEventListener("DOMContentLoaded", function () {
    const features = document.querySelectorAll(".feature"); // Draggable feature map images
    const kernels = document.querySelectorAll(".kernel"); // Dropzones (kernels)

    // Store correct matches
    const correctMatches = {
        "feature1": "kernel1",
        "feature2": "kernel2",
        "feature3": "kernel3",
        "feature4": "kernel4"
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

        alert(`Accuracy: ${correctCount} / ${totalMatches} correct matches!`);
    });
});
