document.addEventListener('DOMContentLoaded', function () {
    
    const target = document.querySelector('#target');
    const textEle = document.querySelector('#canvasText');
    const canvas = document.querySelector('#canvas');
    const reactionTime = document.querySelector('#rtime');

    target.onclick = changePosition;

    const maxX = 1152 - 100;
    const maxY = 420.68 - 102.25;

    let rtime;
    let noOfTarget = 0;
    let n = 30;
    let lagTime = 0;
    let avgrt = 0;
    let lagTimes = [];
     
    function changePosition() {
        canvas.style.alignContent = "start";
        reactionTime.innerHTML = ``;
        clearInterval(rtime);
        textEle.innerHTML = `remaining: ${n - noOfTarget}`;
        target.style.display = "none";

        if (noOfTarget > 0 && noOfTarget <= n) {
            // document.querySelector(`.score${noOfTarget}`).innerHTML = `${lagTime}ms`;
            lagTimes[noOfTarget] = lagTime;
            if (noOfTarget === n) {
                clearInterval(rtime);
                document.querySelector('#rtime').innerHTML = '0ms';
                for (let i = 1; i < n + 1; i++) {
                    avgrt += Number(lagTimes[i]);
                }
                avgrt = (avgrt / n).toFixed(0);
                reactionTime.innerHTML = `average: ${avgrt}ms`;
                noOfTarget = 0;
                lagTimes = [];
                avgrt = 0;
                textEle.innerHTML = `click the target to start again`;
                target.style.left = "50%";
                target.style.top = "50%";
                target.style.transform = "translate(-50%, -50%)";
                target.style.display = "block";
                target.onclick = changePosition; 
                return;
            } 
        }
        
        const positionX = Math.random() * maxX;
        const positionY = Math.random() * maxY;
        
        setTimeout(function() {
            target.style.transform = "none";
            target.style.left = `${positionX}px`;
            target.style.top = `${positionY}px`;
            target.style.display = "inline-block";

            let startTime = performance.now();        
            let elapsedTime;
            rtime = setInterval(function() {
                elapsedTime = performance.now() - startTime;
                // reactionTime.innerHTML = `${elapsedTime.toFixed(0)}ms`;
                lagTime = elapsedTime.toFixed(0);
            }, 1);

        }, 0);
        noOfTarget++;
    }
});