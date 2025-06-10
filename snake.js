const canvas = document.getElementById("game");
const context = canvas.getContext("2d");

const tileSize = 20;
const tilesPerRow = canvas.width / tileSize;

let snakeBody = [{ x: 10, y: 10 }];
let foodPosition = generateRandomFood();

/**
 * Velocity is speed and direction
 * The speed will always be 1
 * Direction is based on the sign (negative or positive along the respective axis)
 * We start moving to the right
 */
let velocityX = 1;
let velocityY = 0;

let touchStartX = 0;
let touchStartY = 0;

function interpretKeyboardInput(event) {
    if (event.key === "ArrowUp" && velocityY === 0) {
        velocityX = 0;
        velocityY = -1;
    } else if (event.key === "ArrowDown" && velocityY === 0) {
        velocityX = 0;
        velocityY = 1;
    } else if (event.key === "ArrowLeft" && velocityX === 0) {
        velocityX = -1;
        velocityY = 0;
    } else if (event.key === "ArrowRight" && velocityX === 0) {
        velocityX = 1;
        velocityY = 0;
    }
}

function interpretMobileInputStart(event) {
    const touch = event.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
}
function interpretMobileInputEnd(event) {
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        //Horizontal swipe
        if (deltaX > 0 && velocityX === 0) {
            //swipe right
            velocityX = 1;
            velocityY = 0;
        } else if (deltaX < 0 && velocityX === 0) {
            //swipe left
            velocityX = -1;
            velocityY = 0;
        }
    } else { //Vertical Swipe
        if (deltaY > 0 && velocityY === 0) {
            //swipe down
            velocityX = 0;
            velocityY = 1;
        } else if (deltaY < 0 && velocityY === 0) {
            //swipe up
            velocityX = 0;
            velocityY = -1;
        }
    }
}


/**
 * Adjust velocity based on user input only if input indicates a change in direction
 */
document.addEventListener("keydown", interpretKeyboardInput);
canvas.addEventListener('touchstart', event => {
    event.preventDefault();
    interpretMobileInputStart(event);
}, { passive: false });
canvas.addEventListener('touchend', event => {
    event.preventDefault();
    interpretMobileInputEnd(event);
}, { passive: false });

//Generate food at a random location
function generateRandomFood() {
    return {
        x: Math.floor(Math.random() * tilesPerRow),
        y: Math.floor(Math.random() * tilesPerRow),
    };
}


function updateGameState() {
    //Apply the updated velocity values calculated during the keydown event
    const nextHeadPosition = {
        x: snakeBody[0].x + velocityX,
        y: snakeBody[0].y + velocityY
    };

    //check if the next head position would collide with a wall
    const hasCollidedWithWall =
        nextHeadPosition.x < 0 ||
        nextHeadPosition.y < 0 ||
        nextHeadPosition.x >= tilesPerRow ||
        nextHeadPosition.y >= tilesPerRow;

    //Check if next head position would collide with itself
    const hasCollidedWithSelf = snakeBody.some(segment =>
        segment.x === nextHeadPosition.x && segment.y === nextHeadPosition.y
    );

    //Respond to collision states just calculated
    if (hasCollidedWithWall || hasCollidedWithSelf) {
        alert("Game Over!");
        snakeBody = [{ x: 10, y: 10 }];
        velocityX = 1;
        velocityY = 0;
        foodPosition = generateRandomFood();
        return;
    }


    /**
     * Update the snake body array with the new next head position 
     * by adding it to the front of the array. This moves the snake
     * in the desired direction.
     */
    snakeBody.unshift(nextHeadPosition);

    //check if the new head position provides the snake with food
    const hasEatenFood =
        nextHeadPosition.x === foodPosition.x &&
        nextHeadPosition.y === foodPosition.y;

    /**
     * If the snake got some food, generate a new food location
     * If the snake did not get food, we need to delete the last element in the 
     * snake body array because there is no increase in the snake's length
     */
    if (hasEatenFood) {
        foodPosition = generateRandomFood();
    } else {
        snakeBody.pop();
    }
}

function renderGame() {
    //delete previous frame
    context.clearRect(0, 0, canvas.width, canvas.height);

    /** Draw Snake
     * Iterate through the snake body and draw a square for each segment
     * The squares are 2 pixels smaller than the tile. 
     * In order to find the pixel position to draw, we need to convert from
     * grid coordinates to pixel position. This is done by multiplying the 
     * grid coordinate by the tile size to direct canvas to draw a rectangle
     * at the upper right corner of the target tile. 
     */
    context.fillStyle = "#00FF00";
    for (const segment of snakeBody) {
        context.fillRect(
            segment.x * tileSize,
            segment.y * tileSize,
            tileSize - 2,
            tileSize - 2
        );
    }

    // Draw food
    context.fillStyle = "#FF0000";
    context.fillRect(
        foodPosition.x * tileSize,
        foodPosition.y * tileSize,
        tileSize - 2,
        tileSize - 2
    );
}

function gameLoop() {
    updateGameState();
    renderGame();
    setTimeout(gameLoop, 100);
}

gameLoop();
