document.addEventListener('DOMContentLoaded', function () {
    
    const target = document.querySelector('#target');
    const textEle = document.querySelector('.clickto');
    target.onclick = changePosition;

    const maxX = 1152 - 100;
    const maxY = 420.95 - 102.25;

    let rtime;
    let noOfTarget = 0;
    let n = 30;
    let lagTime = 0;
    let avgrt = 0;
    let lagTimes = []; 
    function changePosition() {
        document.querySelector("#rtime").innerHTML = ``;
        clearInterval(rtime);
        textEle.innerHTML = `remaining: ${30 - noOfTarget}`;
        target.style.display = "none";

        if (noOfTarget > 0 && noOfTarget <= n) {
            // document.querySelector(`.score${noOfTarget}`).innerHTML = `${lagTime}ms`;
            lagTimes[noOfTarget] = lagTime;
            if (noOfTarget == n) {
                clearInterval(rtime);
                document.querySelector('#rtime').innerHTML = '0ms';
                for (let i = 1; i < n + 1; i++) {
                    avgrt += Number(lagTimes[i]);
                }
                avgrt = (avgrt / n).toFixed(0);
                document.querySelector("#rtime").innerHTML = `average: ${avgrt}ms`;
                noOfTarget = 0;
                lagTimes = [];
                avgrt = 0;
                textEle.innerHTML = `click to start again`;
                target.style.marginLeft = "auto";
                target.style.marginRight = "auto";
                target.style.marginTop = "0";
                target.style.marginBottom = "0";
                target.style.display = "block";
                target.onclick = changePosition; 
                return;
            } 
        }
        
        positionX = Math.random() * maxX;
        positionY = Math.random() * maxY;
        
        setTimeout(function() {
            target.style.marginLeft = `${positionX}px`;
            target.style.marginTop = `${positionY}px`;
            target.style.display = "inline-block";

            let startTime = performance.now();        
            let elapsedTime;
            rtime = setInterval(function() {
                elapsedTime = performance.now() - startTime;
                // document.querySelector("#rtime").innerHTML = `${elapsedTime.toFixed(0)}ms`;
                lagTime = elapsedTime.toFixed(0);
            }, 1);

        }, 0);
        noOfTarget++;
    }
});