const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

// Set canvas size to match container
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Convert % to pixel values
function percentToPixelX(percent) {
    return percent * canvas.width;
}

function percentToPixelY(percent) {
    return percent * canvas.height;
}

// Image coordinates (three-column layout)
const nodes = [
    // original input image
    { x: 0.15, y: 0.50, imgSrc: "static/assets/matchPuzzles/0_enhanced/original.png" }, 

    // feature maps
    { x: 0.85, y: 0.15, imgSrc: "static/assets/matchPuzzles/0_enhanced/vertical.png" },
    { x: 0.85, y: 0.38, imgSrc: "static/assets/matchPuzzles/0_enhanced/horizontal.png" },
    { x: 0.85, y: 0.61, imgSrc: "static/assets/matchPuzzles/0_enhanced/upward.png" },
    { x: 0.85, y: 0.84, imgSrc: "static/assets/matchPuzzles/0_enhanced/downward.png" }
];

// Rectangle nodes (kernels, middle column)
const rectNodes = [
    // kernels
    { x: 0.50, y: 0.15, width: 350, height: 70, text: "Vertical Edge Kernel" },
    { x: 0.50, y: 0.38, width: 350, height: 70, text: "Horizontal Edge Kernel" },
    { x: 0.50, y: 0.61, width: 350, height: 70, text: "Upward Diagonal Kernel" },
    { x: 0.50, y: 0.84, width: 350, height: 70, text: "Downward Diagonal Kernel" }
];

// Connect original image → Kernels & Kernels → Feature maps (aligned)
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

function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connections (from original image -> kernels, kernels -> feature maps)
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    rectConnections.forEach(conn => {
        ctx.beginPath();
        ctx.moveTo(percentToPixelX(conn.from.x), percentToPixelY(conn.from.y));
        ctx.lineTo(percentToPixelX(conn.to.x), percentToPixelY(conn.to.y));
        ctx.stroke();
    });

    // Draw rectangles with text (centered)
    rectNodes.forEach(rect => {
        let rectX = percentToPixelX(rect.x) - rect.width / 2;
        let rectY = percentToPixelY(rect.y) - rect.height / 2;

        ctx.fillStyle = "lightblue"; // Rectangle color
        ctx.fillRect(rectX, rectY, rect.width, rect.height);

        ctx.strokeStyle = "black"; // Border color
        ctx.strokeRect(rectX, rectY, rect.width, rect.height);

        ctx.fillStyle = "black"; // Text color
        ctx.font = "24px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(rect.text, rectX + rect.width / 2, rectY + rect.height / 2);
    });

    // Draw images (centered)
    const scaleFactor = 0.7; 

    nodes.forEach(node => {
        const img = new Image();
        img.src = node.imgSrc;
        img.onload = () => {
            let newWidth = img.width * scaleFactor;
            let newHeight = img.height * scaleFactor;
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

// Ensure the canvas redraws when the window resizes
window.onload = draw;
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    draw();
});
