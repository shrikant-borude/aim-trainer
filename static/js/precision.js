document.addEventListener("DOMContentLoaded", function loaded() {
    
    const canvas = document.querySelector('#canvas');
    const playButton = document.querySelector('#play');
    const displayScore = document.querySelector('#score');

    document.querySelectorAll(".targets").forEach(target => {
        target.style.display = "none";
    }); 

    const maxX = 1047.27 - 10;
    const maxY = 420.95 - 10;

    let score = 0;
    let misses = 0;

    let counter;
    let inCounter;

    playButton.onclick = () => {            
        document.querySelectorAll(".targets").forEach(target => {
            canvas.style.textAlign = "start" 
            canvas.style.alignContent = "normal" 
            playButton.style.display = "none";
            displayScore.innerHTML = `score: ${score}`;
            counter = 2;
            inCounter = 1;

            const positionX = Math.random() * maxX;
            const positionY = Math.random() * maxY;

            target.style.transform = `translate(${positionX}px, ${positionY}px)`;     
        });

        document.addEventListener('click', event => {
            if(event.target.className === "targets") {
                event.target.style.display = "none";
                score++;
                displayScore.innerHTML = `score: ${score}`;
            }
        });

        document.querySelector('#target1').style.display = "inline-block"
        const gameLoop = setInterval(() => {
                if (counter > 5) {
                    if (inCounter > 5) {
                        inCounter = 1;
                    }
                    const differenttarget = document.querySelector(`#target${inCounter}`);
                    if (differenttarget.style.display === "inline-block") {
                        misses++;
                        if (misses === 3) {
                            clearInterval(gameLoop);
                            document.querySelectorAll('.targets').forEach(difftarget => {
                                difftarget.style.display = "none";
                            });
                            document.querySelector('#score').innerHTML = `you lose!<br>final score: ${score}`;
                            playButton.style.display = "inline-block";
                            playButton.innerHTML = 'play again';
                            canvas.style.textAlign = "center" 
                            canvas.style.alignContent = "center" 
                            playButton.onclick = loaded;
                            return;
                        }
                    }
                    document.querySelector(`#target${inCounter}`).style.transform = `translate(${Math.random() * maxX}px, ${Math.random() * maxY}px)`;
                    document.querySelector(`#target${inCounter}`).style.display = "inline-block";
                    inCounter++;
                }
                document.querySelector(`#target${counter}`).style.display = "inline-block";
                counter++;
            }, 1000);
    }
});