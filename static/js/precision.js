document.addEventListener("DOMContentLoaded", function () {
    
    const canvas = document.querySelector('#canvas');
    const playButton = document.querySelector('#play');
    const displayScore = document.querySelector('#score');
    const targets = document.querySelectorAll(".targets");

    targets.forEach(target => {
        target.style.display = "none";
    }); 

    const maxX = 1152 - 10;
    const maxY = 420.95 - 10;

    let score = 0;
    let misses = 0;
    let gameStarted = false;
    let clickCounter = 0;

    // Removing magic numbers
    const MAX_MISSES = 3;
    const TARGET_COUNT = 5;

    let counter;
    let inCounter;

    function randomPosition(target) {
        const positionX = Math.random() * maxX;
        const positionY = Math.random() * maxY;

        target.style.transform = `translate(${positionX}px, ${positionY}px)`; 
    }

    document.addEventListener('click', event => {
        if (event.target.className === "targets") {
            event.target.style.display = "none";
            score++;
            displayScore.innerHTML = `score: ${score}`;
            clickCounter++;
        } else if (event.target.id === "canvas" && gameStarted === true) {
            clickCounter++;
        }
    });

    playButton.onclick = function startGame() {
        gameStarted = true;
        score = 0; 
        misses = 0;            
        targets.forEach(target => {

            canvas.style.textAlign = "start" 
            canvas.style.alignContent = "normal" 
            playButton.style.display = "none";
            
            counter = 2;
            inCounter = 1;
            
            displayScore.innerHTML = `score: ${score}`;
            
            randomPosition(target);    

        });

        document.querySelector('#target1').style.display = "inline-block"
        const gameLoop = setInterval(() => {
                if (counter > TARGET_COUNT) {
                    if (inCounter > TARGET_COUNT) {
                        inCounter = 1;
                    }
                    const currentTarget = document.querySelector(`#target${inCounter}`);
                    if (currentTarget.style.display === "inline-block") {
                        misses++;
                        if (misses === MAX_MISSES) {
                            clearInterval(gameLoop);

                            targets.forEach(target => {
                                target.style.display = "none";
                            });
                            
                            document.querySelector('#score').innerHTML = `game over!<br>accuracy: ${((score / clickCounter) * 100).toFixed(2)}%<br>final score: ${score}`;
                            
                            playButton.style.display = "inline-block";
                            playButton.innerHTML = 'play again';
                            canvas.style.textAlign = "center" 
                            canvas.style.alignContent = "center" 
                            clickCounter = 0;
                            gameStarted = false;

                            playButton.onclick = startGame;
                            return;
                        }
                    }
                    currentTarget.style.transform = `translate(${Math.random() * maxX}px, ${Math.random() * maxY}px)`;
                    currentTarget.style.display = "inline-block";
                    inCounter++;
                }
                document.querySelector(`#target${counter}`).style.display = "inline-block";
                counter++;
            }, 1000);
    }
});