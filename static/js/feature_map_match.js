let original = null;
let vertical = null;
let horizontal = null;
let upward = null;
let downward = null;

document.addEventListener("DOMContentLoaded", function () {
    fetch("static/feature_map_match_puzzle_paths.json")
        .then(response => response.json())
        .then(puzzles => {
            const randomIndex = Math.floor(Math.random() * puzzles.length);
            const selected = puzzles[randomIndex];

            // Set image sources
            original = selected.original;
            vertical = selected.vertical;
            horizontal = selected.horizontal;
            upward = selected.upward;
            downward = selected.downward;

            
            // Map each kernel type to its image path
            const imageMap = {
                vertical: selected.vertical,
                horizontal: selected.horizontal,
                upward: selected.upward,
                downward: selected.downward
            };
            
            // Convert to array and shuffle
            const kernelTypes = Object.keys(imageMap); // ["vertical", "horizontal", "upward", "downward"]
            for (let i = kernelTypes.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [kernelTypes[i], kernelTypes[j]] = [kernelTypes[j], kernelTypes[i]];
            }
            
            // Assign shuffled images to feature boxes and store correct mappings
            const correctMatches = {}; // feature1 -> correct dropzone (based on image meaning)
            const kernelToDropzone = {
                vertical: "drop1",
                horizontal: "drop2",
                upward: "drop3",
                downward: "drop4"
            };
            
            kernelTypes.forEach((kernelType, index) => {
                const featureId = `feature${index + 1}`;
                const imageSrc = imageMap[kernelType];
                document.getElementById(featureId).src = imageSrc;
            
                // store the correct match based on what image was assigned to this feature
                correctMatches[featureId] = kernelToDropzone[kernelType];
            });
  


            console.log(`Loaded puzzle: ${selected.name}`);

            const features = document.querySelectorAll(".feature");
            const kernels = document.querySelectorAll(".dropzone");

            let userMatches = {};

            features.forEach(feature => {
                feature.addEventListener("dragstart", (event) => {
                    event.dataTransfer.setData("text/plain", event.target.id);
                });
            });

            kernels.forEach(kernel => {
                kernel.addEventListener("dragover", (event) => {
                    event.preventDefault();
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

                    if (kernel.children.length > 0) {
                        kernel.removeChild(kernel.firstChild);
                    }

                    const draggedFeature = document.getElementById(draggedFeatureId);
                    kernel.appendChild(draggedFeature);
                    userMatches[draggedFeatureId] = droppedKernelId;
                });
            });

            document.getElementById("testAccuracyButton").addEventListener("click", function () {
                let correctCount = 0;
                let totalMatches = Object.keys(correctMatches).length;

                for (let feature in correctMatches) {
                    if (correctMatches[feature] === userMatches[feature]) {
                        correctCount++;
                    }
                }

                let accuracy = (correctCount / totalMatches) * 100;

                let leftContainer = document.getElementById("leftContainer");
                leftContainer.innerHTML = `
                    <div class="accuracy-display-container">    
                        <p class="accuracy-display-text">Accuracy: ${accuracy}% <br><br>${correctCount} / ${totalMatches} correct matches!</p>
                        
                        <div class="buttonRow">
                            <button class="playAgainButton" onclick="playAgain()">Play Again</button>
                            <button class="nextButton" onclick="redirectToNextLevel()">Next</button>
                        </div>
                    </div>
                `;

                document.getElementById("testAccuracyButton").style.visibility = "hidden";
            });

            // CANVAS LOGIC
            const canvas = document.getElementById("myCanvas");
            const ctx = canvas.getContext("2d");

            function percentToPixelX(percent) {
                return percent * canvas.width;
            }

            function percentToPixelY(percent) {
                return percent * canvas.height;
            }

            function draw() {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                const nodes = [
                    { x: 0.15, y: 0.50, imgSrc: original },
                    { x: 0.85, y: 0.15, imgSrc: vertical },
                    { x: 0.85, y: 0.38, imgSrc: horizontal },
                    { x: 0.85, y: 0.61, imgSrc: upward },
                    { x: 0.85, y: 0.84, imgSrc: downward }
                ];

                const rectNodes = [
                    { x: 0.50, y: 0.15, width: 350, height: 70, text: "Vertical Edge Kernel" },
                    { x: 0.50, y: 0.38, width: 350, height: 70, text: "Horizontal Edge Kernel" },
                    { x: 0.50, y: 0.61, width: 350, height: 70, text: "Upward Diagonal Kernel" },
                    { x: 0.50, y: 0.84, width: 350, height: 70, text: "Downward Diagonal Kernel" }
                ];

                const rectConnections = [
                    { from: { x: nodes[0].x + 0.03, y: nodes[0].y }, to: { x: rectNodes[0].x - 0.05, y: rectNodes[0].y } },
                    { from: { x: nodes[0].x + 0.03, y: nodes[0].y }, to: { x: rectNodes[1].x - 0.05, y: rectNodes[1].y } },
                    { from: { x: nodes[0].x + 0.03, y: nodes[0].y }, to: { x: rectNodes[2].x - 0.05, y: rectNodes[2].y } },
                    { from: { x: nodes[0].x + 0.03, y: nodes[0].y }, to: { x: rectNodes[3].x - 0.05, y: rectNodes[3].y } },
                    { from: { x: rectNodes[0].x + 0.05, y: rectNodes[0].y }, to: { x: nodes[1].x, y: nodes[1].y } },
                    { from: { x: rectNodes[1].x + 0.05, y: rectNodes[1].y }, to: { x: nodes[2].x, y: nodes[2].y } },
                    { from: { x: rectNodes[2].x + 0.05, y: rectNodes[2].y }, to: { x: nodes[3].x, y: nodes[3].y } },
                    { from: { x: rectNodes[3].x + 0.05, y: rectNodes[3].y }, to: { x: nodes[4].x, y: nodes[4].y } }
                ];

                // Draw connections
                ctx.strokeStyle = "black";
                ctx.lineWidth = 3;
                rectConnections.forEach(conn => {
                    ctx.beginPath();
                    ctx.moveTo(percentToPixelX(conn.from.x), percentToPixelY(conn.from.y));
                    ctx.lineTo(percentToPixelX(conn.to.x), percentToPixelY(conn.to.y));
                    ctx.stroke();
                });

                // Draw rectangles
                rectNodes.forEach(rect => {
                    let rectX = percentToPixelX(rect.x) - rect.width / 2;
                    let rectY = percentToPixelY(rect.y) - rect.height / 2;

                    ctx.fillStyle = "lightblue";
                    ctx.fillRect(rectX, rectY, rect.width, rect.height);

                    ctx.strokeStyle = "black";
                    ctx.strokeRect(rectX, rectY, rect.width, rect.height);

                    ctx.fillStyle = "black";
                    ctx.font = "24px Arial";
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.fillText(rect.text, rectX + rect.width / 2, rectY + rect.height / 2);
                });

                // Draw images
                const scaleFactor = 0.7;
                nodes.forEach(node => {
                    const img = new Image();
                    img.src = node.imgSrc;
                    img.onload = () => {
                        const newWidth = img.width * scaleFactor;
                        const newHeight = img.height * scaleFactor;
                        ctx.drawImage(
                            img,
                            percentToPixelX(node.x) - newWidth / 2,
                            percentToPixelY(node.y) - newHeight / 2,
                            newWidth,
                            newHeight
                        );
                    };
                });
            }

            draw(); // Initial draw
            window.addEventListener("resize", draw); // Redraw on resize
        })
        .catch(error => {
            console.error("Error loading puzzle JSON:", error);
        });
});

// TODO: fix bug with some feature maps disappearing when dropped into a dropzone
