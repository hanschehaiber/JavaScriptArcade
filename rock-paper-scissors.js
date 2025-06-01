const options = ['rock', 'paper', 'scissors'];
const playerDisplay = document.getElementById('playerDisplay');
const computerDisplay = document.getElementById('computerDisplay');
const resultsDisplay = document.getElementById('resultDisplay');
const playerScoreDisplay = document.getElementById('playerScoreDisplay');
const computerScoreDisplay = document.getElementById('computerScoreDisplay');
let playerScore = 0;
let computerScore = 0;
const winMessage = "You Win!";
const loseMessage = "You Lose!";

function playGame(playerChoice) {
    const computerChoice = options[Math.floor(Math.random() * 3)];
    let result = "";

    if (playerChoice === computerChoice) {
        result = 'Draw!';
    } else {
        switch (playerChoice) {
            case "rock":
                result = (computerChoice === 'scissors') ? winMessage : loseMessage;
                break;
            case "paper":
                result = (computerChoice === 'rock') ? winMessage : loseMessage;
                break;
            case "scissors":
                result = (computerChoice === 'paper') ? winMessage : loseMessage;
                break;
        }
    }
    playerDisplay.textContent = `Player: ${playerChoice}`;
    computerDisplay.textContent = `Computer: ${computerChoice}`;
    resultsDisplay.textContent = `Result: ${result}`;

    resultsDisplay.classList.remove('greenText', 'redText');

    switch (result) {
        case winMessage:
            resultsDisplay.classList.add('greenText');
            playerScore++;
            playerScoreDisplay.textContent = playerScore;
            break;
        case loseMessage:
            resultsDisplay.classList.add('redText');
            computerScore++;
            computerScoreDisplay.textContent = computerScore;
            break;
    }
}