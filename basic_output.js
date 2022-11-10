// updates all output
function updateAllOutput() {
    var deckSize = parseInt(document.getElementById("deckSize").value, 10);
    var handSize = parseInt(document.getElementById("handSize").value, 10);
    var numStarters = parseInt(document.getElementById("numStarters").value, 10);
    var basicDistribution = generateBasicDistribution(deckSize, handSize, numStarters);

    updateProbabilityOutput(basicDistribution);
    updateProbabilityTable(basicDistribution);
    updateProbabilityGraph(basicDistribution);
}

// updates the probabilityOutput element on form input change
function updateProbabilityOutput(distBasic) {
    var liveProbability = 0;
    for (const [key, value] of Object.entries(distBasic)) {
        if (key > 0) {liveProbability += value}
    }
    var output = document.getElementById("probabilityOutput");
    output.innerHTML = (100 * liveProbability).toFixed(2).toString() + '%';
}

// updates the probabilityTable element on form input change
function updateProbabilityTable(distBasic) {
    var outputTable = document.getElementById("probabilityTableOutput");
    outputTable.innerHTML = `<tr><td>Number of Matches</td><td>Probability of Exact Match</td>`
 
    for (const [key, value] of Object.entries(distBasic)) {
        var displayProbability = (100 * value).toFixed(2).toString() + '%';
        var newTableRow = `<tr><td align="right">${key}</td><td align="right">${displayProbability}</td></tr>`;
        outputTable.innerHTML += newTableRow;
    }
}

// update the bar graph on form input change
function updateProbabilityGraph(distBasic) {
    let chartStatus = Chart.getChart("barGraphOutput"); // <canvas> id
    if (chartStatus != undefined) {
      chartStatus.destroy();
    }

    let ctx = document.getElementById("barGraphOutput");
    var xValues = [];
    var yValues = [];
    for (const [key, value] of Object.entries(distBasic)) {
        xValues.push(key);
        yValues.push(value);
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
