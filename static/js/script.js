document.addEventListener('DOMContentLoaded', function() {
    
    const canvas = document.querySelector('#canvas');
    const submit = document.querySelector('#submit');

    submit.style.display = "none";
    
    canvas.style.backgroundColor = "#0000ff";
    let rt = 0;
    let n = 5;
    let avg = 0;
    let attempts = 0;
    const array = []; 
    
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
            attempts++;
            canvas.style.backgroundColor = "#00ff00";
            canvas.style.color = "#ffffff"
            canvas.innerHTML = 'click!';
            
            // AI suggested to use performance.now() instead of Date.now() for more accurate ms count 
            let startTime = performance.now();        

            let rtime = setInterval(function() {
                let elapsedTime = performance.now() - startTime;
                document.querySelector("#rtime").innerHTML = `${elapsedTime.toFixed(0)}ms`;
                rt = elapsedTime;
            }, 1);

            canvas.onclick = function() {
                clearInterval(rtime);
                array[attempts] = rt;
                if (attempts % 5 == 0) {
                    avg = 0; 
                    for (let i = 1; i <= n; i++) {
                        avg += Number(array[i]);
                    }
                    const average = (avg / n).toFixed(0);
                    canvas.style.backgroundColor = "blue";
                    canvas.innerHTML = `average: ${average}ms<br>click to keep going`;
                
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
                                                mode_id: 1,
                                                accuracy: null,
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
                                    } else if (event.target.id === "canvas") {
                                        submit.style.display = "none";
                                    }
                                })
                            }
                        }
                    )

                    attempts = attempts % 5;
                    canvas.onclick = reactionTime;
                    return;
                }
                canvas.style.backgroundColor = "blue";
                canvas.innerHTML = "click to keep going";
                canvas.onclick = reactionTime;
            };

        }, time);

    };

});