document.addEventListener('DOMContentLoaded', function () {
    
    const target = document.querySelector('#target');
    const textEle = document.querySelector('#canvasText');
    const canvas = document.querySelector('#canvas');
    const reactionTime = document.querySelector('#rtime');
    const submit = document.querySelector('#submit');

    submit.style.display = "none";

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

    const maxX = canvas.offsetWidth - 100;
    const maxY = canvas.offsetHeight - 100;

    let noOfTarget = 0;
    let n = 30;
    let avgrt = 0;
    let lagTimes = [];
    let startTime;

    function resetGame() {
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
    }
     
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
                const average = (avgrt / n).toFixed(0);
                const accuracy = ((lagTimes.length / clickCounter) * 100).toFixed(2);
                reactionTime.innerHTML = `average: ${average}ms<br>accuracy: ${accuracy}%`;
                
                fetch("/login_status")
                .then(response => response.json())
                .then(data => {
                        if (data["logged_in"]) {
                            submit.style.display = "block";
                            document.addEventListener('click', event => {
                                if (event.target.id === "submit") {
                                    fetch("/save_stats", {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json"
                                        },
                                        body: JSON.stringify ({
                                            mode_id: 2,
                                            accuracy: accuracy,
                                            average: average,
                                            score: null
                                        })
                                    })
                                    .then(response => response.json())
                                    .then(data => {
                                        if (data.success) {
                                            location.reload();
                                        }
                                    })
                                    .catch(error => console.error(error));
                                } else if (event.target.id === "target") {
                                    submit.style.display = "none";
                                }
                            })
                        }
                    }
                )
                resetGame();
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