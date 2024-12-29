let score = 0; // Correct answers
let errors = 0; // Wrong answers
let speed = 5000; // Start speed 
let correctAnswer;
let character = document.getElementById('character');
let gates = document.querySelectorAll('.gate');
let questionElement = document.getElementById('question');
let scoreElement = document.getElementById('score');
let errorElement = document.getElementById('errors'); // Element to display errors
let gameOverElement = document.getElementById('game-over');
let gameInterval;
let isWaiting = false; // Flag to indicate if the game is waiting

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function startGame() {
    spawnQuestion();
    gameInterval = setInterval(moveGates, speed);
    setInterval(updateSpeed, 10000);
    moveToNearestGate(1);
}

function updateSpeed() {
    speed = speed*0.98;
    clearInterval(gameInterval);
    gameInterval = setInterval(moveGates, speed);
}

function spawnQuestion() {
    let num1 = Math.floor(Math.random() * 96)+3;
    let num2 = Math.floor(Math.random() * 10)+3;
    correctAnswer = num1 * num2;
    let wrongAnswers = [correctAnswer];
    
    while (wrongAnswers.length < 4) {
        let wrongAnswer = (Math.floor(Math.random() * 96)+3 ) * (Math.floor(Math.random() * 10)+3);
        if (!wrongAnswers.includes(wrongAnswer)) {
            wrongAnswers.push(wrongAnswer);
        }
    }
    
    wrongAnswers.sort(() => Math.random() - 0.5);
    questionElement.textContent = `${num1} x ${num2} = ?`;
    gates.forEach((gate, index) => {
        gate.textContent = wrongAnswers[index];
        gate.style.top = '0px'; // Reset position
    });
}

function moveGates() {
    gates.forEach(gate => {
        let gatePosition = parseInt(window.getComputedStyle(gate).getPropertyValue("top"));
        if (gatePosition < 250) {
            gate.style.top = gatePosition + 1 + 'px'; // Move down
        } else {
            // Reset gate position if it goes out of bounds
            gate.style.top = '0px';
        }
    });
}

function checkAnswers() {
    gates.forEach(gate => {
        // Get the answer from the gate
        let answer = parseInt(gate.textContent);
        // Get the position of the character
        let characterPosition = parseInt(window.getComputedStyle(character).getPropertyValue("left"));
        let gatePosition = parseInt(window.getComputedStyle(gate).getPropertyValue("left"));

        // Adjust for widths: character width is 30px, gate width is 50px
        let characterLeft = characterPosition;
        let characterRight = characterPosition + 30; // Character width

        let gateLeft = gatePosition;
        let gateRight = gatePosition + 50; // Gate width

        // Check if the character is overlapping with the gate
        if (characterRight > gateLeft && characterLeft < gateRight) {
            // Check if the answer is correct
            if (answer === correctAnswer) {
                score++;
                scoreElement.textContent = `Punkte: ${score}`;
            } else {
                errors++;
                errorElement.textContent = `Fehler: ${errors}`; // Update error count display
                if (errors >= 10) {
                    endGame();
                }
                
                // Set background color to red for 200ms
                const gameArea = document.getElementById("game-area");
                gameArea.style.backgroundColor = "red";
                setTimeout(() => {
                    gameArea.style.backgroundColor = ""; // Reset to original color
                }, 200);
            }
        }
    });
    
    spawnQuestion();
}

function endGame() {
    clearInterval(gameInterval);
    questionElement.style.display = 'none';
    scoreElement.style.display = 'none';
    errorElement.style.display = 'none'; // Hide error display
    gameOverElement.textContent = `Spiel vorbei! Total Punkte: ${score}, Fehler: ${errors}`; // Show both scores
    gameOverElement.style.display = 'block';
}

document.addEventListener('keydown', (event) => {
    const leftKey = 37;
    const rightKey = 39;
    const spaceKey = 32; // Space key code
    let characterPosition = parseInt(window.getComputedStyle(character).getPropertyValue("left"));
    
    if (event.keyCode === leftKey) {
        // Move to the left gate
        moveToNearestGate(-1);
    } else if (event.keyCode === rightKey) {
        // Move to the right gate
        moveToNearestGate(1);
    } else if (event.keyCode === spaceKey) {
        // Move gates to the bottom
        gates.forEach(gate => {
            gate.style.top = '250px'; // Move gate to the bottom
        });

        checkAnswers();
    }
});

// Add click event listeners for the arrow buttons
document.getElementById('left-button').addEventListener('click', () => {
    moveToNearestGate(-1); // Move to the left gate
});

document.getElementById('right-button').addEventListener('click', () => {
    moveToNearestGate(1); // Move to the right gate
});

function moveToNearestGate(direction) {
    let gatePositions = Array.from(gates).map(gate => parseInt(window.getComputedStyle(gate).getPropertyValue("left")));
    let characterPosition = parseInt(window.getComputedStyle(character).getPropertyValue("left"));
    
    // Find the nearest gate based on the direction
    let targetGate = null;
    if (direction === -1) {
        // Move left
        targetGate = gatePositions.filter(pos => pos < characterPosition).sort((a, b) => b - a)[0]; // Get the closest left gate
    } else if (direction === 1) {
        // Move right
        targetGate = gatePositions.filter(pos => pos > characterPosition).sort((a, b) => a - b)[0]; // Get the closest right gate
    }

    // If a target gate is found, move the character to that position
    if (targetGate !== undefined) {
        character.style.left = targetGate + 'px';
    }
}

// Modify the game loop to check answers when gates reach the bottom
function moveGates() {
    gates.forEach(gate => {
        let gatePosition = parseInt(window.getComputedStyle(gate).getPropertyValue("top"));
        if (gatePosition < 250) {
            gate.style.top = gatePosition + 5 + 'px'; // Move down
        } else {
            // Check answers when the gate reaches the bottom
            checkAnswers();
        }
    });
}

startGame();