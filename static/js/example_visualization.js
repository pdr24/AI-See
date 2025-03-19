const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

// Set canvas size to match container
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Image coordinates
const nodes = [
    { x: 150, y: 400, imgSrc: "static/assets/0_example/digit_0_original.png" },
    { x: 600, y: 125, imgSrc: "static/assets/0_example/digit_0_vertical_edges.png" },
    { x: 600, y: 325, imgSrc: "static/assets/0_example/digit_0_horizontal_edges.png" },
    { x: 600, y: 525, imgSrc: "static/assets/0_example/digit_0_diagonal_1_edges.png" },
    { x: 600, y: 725, imgSrc: "static/assets/0_example/digit_0_diagonal_2_edges.png" }
];

// Rectangle nodes (text boxes)
const rectNodes = [
    { x: 300, y: 100, width: 200, height: 50, text: "Vertical Edge Kernel" },
    { x: 300, y: 300, width: 200, height: 50, text: "Horizontal Edge Kernel" },
    { x: 300, y: 500, width: 200, height: 50, text: "Upward Diagonal Kernel" },
    { x: 300, y: 700, width: 200, height: 50, text: "Downward Diagonal Kernel" }
];

// Connect rectangles to images
const rectConnections = [
    { from: { x: 150, y: 400 }, to: { x: 300, y: 125 } }, 
    { from: { x: 150, y: 400 }, to: { x: 300, y: 325 } },
    { from: { x: 150, y: 400 }, to: { x: 300, y: 525 } },
    { from: { x: 150, y: 400 }, to: { x: 300, y: 725 } },
    
    { from: { x: 300, y: 125 }, to: { x: 600, y: 125 } }, 
    { from: { x: 300, y: 325 }, to: { x: 600, y: 325 } },
    { from: { x: 300, y: 525 }, to: { x: 600, y: 525 } },
    { from: { x: 300, y: 725 }, to: { x: 600, y: 725 } },
];

function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connections between images and rectangles
    rectConnections.forEach(conn => {
        ctx.beginPath();
        ctx.moveTo(conn.from.x, conn.from.y);
        ctx.lineTo(conn.to.x, conn.to.y);
        ctx.stroke();
    });

    // Draw rectangles with text
    rectNodes.forEach(rect => {
        ctx.fillStyle = "lightblue"; // Rectangle color
        ctx.fillRect(rect.x, rect.y, rect.width, rect.height);

        ctx.strokeStyle = "black"; // Border color
        ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);

        ctx.fillStyle = "black"; // Text color
        ctx.font = "16px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(rect.text, rect.x + rect.width / 2, rect.y + rect.height / 2);
    });

    // Draw images
    const scaleFactor = 2; // Adjust scale as needed

    nodes.forEach(node => {
        const img = new Image();
        img.src = node.imgSrc;
        img.onload = () => {
            let newWidth = img.width * scaleFactor;
            let newHeight = img.height * scaleFactor;
            ctx.drawImage(img, node.x - newWidth / 2, node.y - newHeight / 2, newWidth, newHeight);
        };
    });
}

window.onload = draw;
