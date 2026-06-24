document.addEventListener('DOMContentLoaded', function() {
    
    const canvas = document.querySelector('.canvas');
    canvas.style.backgroundColor = "#0000ff";

    canvas.onclick = function reactionTime() {
        let eventFlag = false;
        canvas.style.backgroundColor = "#ff0000";        
        canvas.innerHTML = 'wait for green';

        let time = 0;
        while (time <= 2000 || time > 5000) {
            time = Math.floor(Math.random() * 10000);
        }
        
        canvas.onclick = function () { 
            eventFlag = true;
        };

        setTimeout(function() {
            if (eventFlag) {
                canvas.style.backgroundColor = "#0000ff";
                canvas.innerHTML = "too early! :(<br>click to keep going";
                canvas.onclick = reactionTime;
                return;
            }
            canvas.style.backgroundColor = "#00ff00";
            canvas.style.color = "#ffffff"
            canvas.innerHTML = 'click!';
            
            // AI suggested to use performance.now() instead of Date.now() for more accurate ms count 
            let startTime = performance.now();        

            let rtime = setInterval(function() {
                let elapsedTime = performance.now() - startTime;
                document.querySelector("#rtime").innerHTML = `${elapsedTime.toFixed(0)}ms`;
            }, 1);

            canvas.onclick = function() {
                clearInterval(rtime);
                canvas.style.backgroundColor = "blue";
                canvas.innerHTML = "click to keep going";
                canvas.onclick = reactionTime;
            };

        }, time);

    };

});