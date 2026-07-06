document.addEventListener('DOMContentLoaded', function () {
    
    const target = document.querySelector('#target');
    const textEle = document.querySelector('#canvasText');
    const canvas = document.querySelector('#canvas');
    const reactionTime = document.querySelector('#rtime');

    let clickCounter = 0;
    let gameStarted = false;

    document.addEventListener("click", (event) => {
        if (event.target.id === "target") {
            if (gameStarted) {
                clickCounter++;
                noOfTarget++;
            }
            changePosition();
        } else if (event.target.id === "canvas" && gameStarted === true) {
            clickCounter++;
        }
    });

    const maxX = 1152 - 100;
    const maxY = 420.68 - 102.25;

    let noOfTarget = 0;
    let n = 30;
    let avgrt = 0;
    let lagTimes = [];
    let startTime;

     
    function changePosition() {
        gameStarted = true;
        canvas.style.alignContent = "start";
        reactionTime.innerHTML = ``;
        textEle.innerHTML = `remaining: ${n - noOfTarget}`;
        target.style.display = "none";

        if (noOfTarget > 0 && noOfTarget <= n) {
            lagTimes.push(Math.round(performance.now() - startTime));
            // document.querySelector(`.score${noOfTarget}`).innerHTML = `${lagTime}ms`;
            if (noOfTarget === n) {
                document.querySelector('#rtime').innerHTML = '0ms';
                for (let i = 0; i < n; i++) {
                    avgrt += Number(lagTimes[i]);
                }
                avgrt = (avgrt / n).toFixed(0);
                console.log(`n: ${n}`)
                console.log(`noOfTarget: ${noOfTarget}`)
                console.log(`clickCounter: ${clickCounter}`)
                console.log(`length: ${lagTimes}`)
                
                reactionTime.innerHTML = `average: ${avgrt}ms<br>accuracy: ${((lagTimes.length / clickCounter) * 100).toFixed(2)}%`;
                noOfTarget = 0;
                lagTimes.length = 0;
                avgrt = 0;
                clickCounter = 0;
                startTime = 0;
                gameStarted = false;
                textEle.innerHTML = `click the target to start again`;
                target.style.left = "50%";
                target.style.top = "50%";
                target.style.transform = "translate(-50%, -50%)";
                target.style.display = "block";
                return;
            } 
        }
        
        const positionX = Math.random() * maxX;
        const positionY = Math.random() * maxY;
        
        target.style.transform = "none";
        target.style.left = `${positionX}px`;
        target.style.top = `${positionY}px`;
        target.style.display = "inline-block";

        startTime = performance.now();       

    }
});