const max_pillarHeight = 490;
const min_pillarHeight = 100;
const gravity = 0.2; // Gravity acceleration.
const flapStrength = -4; // Flap velocity.
const pillarSpeed = 2; // Speed of pillars.
const gameHeight = 600; // Game container height.

let birdTop = 250; // Initial bird position.
let birdVelocity = 0; // Bird's vertical velocity.
let isFlapping = false; // Flag to track flapping.
let gameRunning = true; // Game state flag.
let score = 0;

// Get elements.
const bird = document.getElementById("bird-1");
const pillarUp = document.getElementById("pillarUp");
const pillarDown = document.getElementById("pillarDown");
const playButton = document.getElementById("play");
const playContainer = document.querySelector(".play_container");

// Game state initialization.
let pillarX = 500; // Initial pillar position.

// Play button event listener.
playButton.addEventListener("click", () => {
    playContainer.style.display = "none"; // Hide play container.
    startGame();
});

function startGame() {
    function gameLoop() {
        if (!gameRunning) return;

        // Update bird position.
        birdVelocity += gravity; // Apply gravity.
        birdTop += birdVelocity; // Update bird's vertical position.

        // Prevent bird from flying off top or bottom.
        if (birdTop < 0) birdTop = 0;
        if (birdTop > gameHeight - 50) {
            endGame(); // Bird hit the ground.
        }

        bird.style.top = `${birdTop}px`;

        // Move pillars.
        pillarX -= pillarSpeed;
        if (pillarX < -80) {
            pillarX = 500; // Reset pillar position.
            updatePillarHeights();
            score++; // Increment score.
        }
        pillarUp.style.left = `${pillarX}px`;
        pillarDown.style.left = `${pillarX}px`;

        // Collision detection.
        checkCollision();

        // Request the next frame.
        requestAnimationFrame(gameLoop);
    }

    // Start the game loop.
    requestAnimationFrame(gameLoop);
}

// Flap function.
function flap() {
    if (!isFlapping) {
        isFlapping = true;
        birdVelocity = flapStrength; // Apply upward velocity.
        setTimeout(() => (isFlapping = false), 150); // Reset flapping state after 150ms.
    }
}

// Update pillar heights randomly.
function updatePillarHeights() {
    const randomHeight = Math.floor(Math.random() * (max_pillarHeight - min_pillarHeight + 1)) + min_pillarHeight;
    pillarUp.style.height = `${randomHeight}px`;
    pillarDown.style.height = `${max_pillarHeight - randomHeight}px`; // Ensure a gap of 150px.
}

// Collision detection logic.
function checkCollision() {
    const birdRect = bird.getBoundingClientRect();
    const pillarUpRect = pillarUp.getBoundingClientRect();
    const pillarDownRect = pillarDown.getBoundingClientRect();

    // Add a buffer around the bird's bounding box
    const buffer = 15; // Reduce collision sensitivity by 5px on all sides
    const birdBounds = {
        left: birdRect.left + buffer,
        right: birdRect.right - buffer,
        top: birdRect.top + buffer,
        bottom: birdRect.bottom - buffer,
    };

    // Check collision with top pillar
    const collidesWithTopPillar =
        birdBounds.right > pillarUpRect.left &&
        birdBounds.left < pillarUpRect.right &&
        birdBounds.top < pillarUpRect.bottom;

    // Check collision with bottom pillar
    const collidesWithBottomPillar =
        birdBounds.right > pillarDownRect.left &&
        birdBounds.left < pillarDownRect.right &&
        birdBounds.bottom > pillarDownRect.top;

    // Check if bird collided with any pillar
    if (collidesWithTopPillar || collidesWithBottomPillar) {
        endGame(); // End the game if a collision is detected
    }
}






// |------------|
// |   Pillar   |     <-- Top Pillar (pillarUp)
// |    Box     |
// |------------|

//         GAP               🐦    <-- Bird (birdRect)

// |------------|
// |    Box     |     <-- Bottom Pillar (pillarDown)
// |   Pillar   |
// |------------|







// End game function.
function endGame() {
    gameRunning = false;
    alert(`Game Over! Your score: ${score}`);
    window.location.reload(); // Reload the page to restart.
}

// Event listeners for controls.
document.addEventListener("click", flap);
document.addEventListener("keydown", (e) => {
    if (e.code === "Space") flap();
});
