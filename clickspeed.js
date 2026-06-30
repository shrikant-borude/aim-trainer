document.addEventListener('DOMContentLoaded', function reload() {
    const canvas = document.querySelector('.canvas');
    const count = document.querySelector('.clickto');
    let counter = 0;
    let gameOver = false;
    document.querySelector('#reset').style.display = 'none';
    count.innerHTML = "click to start"
    document.querySelector("#timer").innerHTML = '0s';
    function startTimer() {
        gameOver = false;
        let startTime = Date.now();        

        let rtime = setInterval(function() {
            let elapsedTime = Date.now() - startTime;
            document.querySelector("#timer").innerHTML = `${(elapsedTime / 1000).toFixed(0)}s`;
            if (elapsedTime >= 5000) {
                clearInterval(rtime);
                count.innerHTML = `your clicks per second: ${(counter / 5).toFixed(2)}`;
                gameOver = true;
                counter = 0;
                document.querySelector('#reset').style.display = "inline-block";
                document.querySelector('#reset').onclick = () => {
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
        if (counter == 1) {
            document.querySelector('#reset').style.display = 'none';
            startTimer();
        }
        count.innerHTML = `clicks: ${counter}`
        canvas.style.backgroundColor = "rgba(237, 237, 237, 0.26)";
    };

    canvas.onmousedown = countdown;
    canvas.onmouseup = () => {
        canvas.style.backgroundColor = "rgba(237, 237, 237, 0.182)";
    };
});