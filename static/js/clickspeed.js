document.addEventListener('DOMContentLoaded', function reload() {
    const canvas = document.querySelector('#canvas');
    const count = document.querySelector('#canvasText');
    const resetBtn = document.querySelector('#reset');
    const timer = document.querySelector("#timer");
    const submit = document.querySelector('#submit');

    submit.style.display = "none";

    let counter = 0;
    let gameOver = false;

    const GAME_TIME = 5000;
 
    resetBtn.style.display = 'none';
    count.innerHTML = "click to start"
    timer.innerHTML = '0s';
    
    function startTimer() {
        gameOver = false;
        let startTime = Date.now();        

        let gameTimer = setInterval(function() {
            let elapsedTime = Date.now() - startTime;
            timer.innerHTML = `${(elapsedTime / 1000).toFixed(0)}s`;
            
            if (elapsedTime >= GAME_TIME) {
                clearInterval(gameTimer);
                
                const average = (counter / (GAME_TIME / 1000)).toFixed(2);
                const score = counter;
                count.innerHTML = `your clicks per second: ${average}`;
        
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
                                            mode_id: 3,
                                            accuracy: null,
                                            average: average,
                                            score: score
                                        })
                                    })
                                    .then(response => response.json())
                                    .then(data => {
                                        if (data.success) {
                                            location.reload();
                                        }
                                    })
                                    .catch(error => console.error(error));
                                } else if (event.target.id === "reset") {
                                    submit.style.display = "none";
                                }
                            })
                        }
                    }
                )

                gameOver = true;
                counter = 0;
                resetBtn.style.display = "inline-block";
        
                resetBtn.onclick = () => {
                    gameOver = false;
                    reload();
                };
        
                return;
            }
        
        }, 1000);
    }

    function countdown() {
        if (gameOver) {
            return;
        }
        
        counter++;
        
        if (counter === 1) {
            resetBtn.style.display = 'none';
            startTimer();
        }
        
        count.innerHTML = `clicks: ${counter}`
        canvas.style.backgroundColor = "rgba(237, 237, 237, 0.26)";
    };

    function releaseCanvas() {
        canvas.style.backgroundColor = "rgba(237, 237, 237, 0.182)";
    }

    canvas.onmousedown = countdown;
    canvas.onmouseup = releaseCanvas;
});