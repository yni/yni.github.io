// updates all output
function updateAllOutput() {
    updateProbability();
    updateProbabilityTable();
    createProbabilityGraph();
}

// updates the probabilityOutput element on form input change
function updateProbability() {
    var deckSize = parseInt(document.getElementById("deckSize").value, 10);
    var handSize = parseInt(document.getElementById("handSize").value, 10);
    var numStarters = parseInt(document.getElementById("numStarters").value, 10);
    var liveProbability = calculateProbability(deckSize, handSize, numStarters);
    var output = document.getElementById("probabilityOutput");
    output.innerHTML = (100 * liveProbability).toFixed(2).toString() + '%';
}

// updates the probabilityTable element on form input change
function updateProbabilityTable() {
    var deckSize = parseInt(document.getElementById("deckSize").value, 10);
    var handSize = parseInt(document.getElementById("handSize").value, 10);
    var numStarters = parseInt(document.getElementById("numStarters").value, 10);
    var outputTable = document.getElementById("probabilityTableOutput");

    outputTable.innerHTML = `<tr><td>Number of Matches</td><td>Probability of Exact Match</td>`
    
    for (let i = 0; i < handSize + 1; i++) {
        var iProbability = calculateExactProbability(deckSize, handSize, numStarters, i);
        iProbability = (100 * iProbability).toFixed(2).toString() + '%';
        var newTableRow = `<tr><td>${i}</td><td>${iProbability}</td></tr>`;
        outputTable.innerHTML += newTableRow;
    } 
}

// update the bar graph on form input change
function createProbabilityGraph() {
    var deckSize = parseInt(document.getElementById("deckSize").value, 10);
    var handSize = parseInt(document.getElementById("handSize").value, 10);
    var numStarters = parseInt(document.getElementById("numStarters").value, 10); 
    
    let chartStatus = Chart.getChart("barGraphOutput"); // <canvas> id
    if (chartStatus != undefined) {
      chartStatus.destroy();
    }

    let ctx = document.getElementById("barGraphOutput");

    var xValues = [];
    var yValues = [];

    for (let i = 0; i < handSize + 1; i++) {
        xValues[i] = i;
        yValues[i] = calculateExactProbability(deckSize, handSize, numStarters, i);
    }

    var myChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: xValues,
            datasets: [{
                label: "Probability of Drawing Exactly X Matches",
                //backgroundColor: barColors,
                backgroundColor: "blue",
                data: yValues
            }]
        },
        options: {
            scales: {
                y: {
                    ticks: {
                        callback: function(value, index, ticks) {
                            return (100 * value).toFixed(0) + '%';
                        }
                    },
                    title: {
                        display: true,
                        text: 'Probability'
                    }
                }
            }
        }
    });
}