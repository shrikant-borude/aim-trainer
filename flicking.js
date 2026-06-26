document.addEventListener('DOMContentLoaded', function () {
    
    const target = document.querySelector('#target');
    const textEle = document.querySelector('.clickto');
    target.onclick = changePosition;

    const maxX = 1152 - 100;
    const maxY = 420.95 - 102.25;

    let rtime;

    function changePosition() {
        clearInterval(rtime);
        textEle.innerHTML = 'click the targets';
        target.style.display = "none";
        
        positionX = Math.random() * maxX;
        positionY = Math.random() * maxY;
        
        setTimeout(function() {
            target.style.marginLeft = `${positionX}px`;
            target.style.marginTop = `${positionY}px`;
            target.style.display = "inline-block";

            let startTime = performance.now();        

            rtime = setInterval(function() {
                let elapsedTime = performance.now() - startTime;
                document.querySelector("#rtime").innerHTML = `${elapsedTime.toFixed(0)}ms`;
            }, 1);
        }, 2000);
    }
});