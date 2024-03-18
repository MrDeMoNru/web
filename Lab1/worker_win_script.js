onmessage = function(event) {
    let scoreX = event.data.scoreX;
    let scoreO = event.data.scoreO;
    let winner = findWinner(scoreX, scoreO);
    console.log(winner);
    postMessage({data: winner});
};

function findWinner(scoreX, scoreO) {
    if (scoreX.length >= 4) {
        return 1;
    }

    if (scoreO.length >= 4) {
        return 2;
    }

    else {
        return null;
    }
}