// updates all output
function updateAllOutput() {
    var deckSize = parseInt(document.getElementById("deckSize").value, 10);
    var handSize = parseInt(document.getElementById("handSize").value, 10);
    var numStarters = parseInt(document.getElementById("numStarters").value, 10);
    
    var deckDelta = parseInt(document.getElementById("deckDelta").value, 10);
    var handDelta = parseInt(document.getElementById("handDelta").value, 10);
    var startersDelta = parseInt(document.getElementById("startersDelta").value, 10);
    
    var basicDistribution = generateBasicDistribution(deckSize, handSize, numStarters);
    var altDistribution = generateBasicDistribution(deckSize + deckDelta, handSize + handDelta, numStarters + startersDelta);
    var differenceDistribution = compareDistribution(basicDistribution, altDistribution);
    
    updateProbabilityOutput(basicDistribution, "probabilityOutput");
    updateProbabilityTable(basicDistribution, "probabilityTableOutput");
    updateProbabilityGraph(basicDistribution, "barGraphOutput");
    updateProbabilityDelta(basicDistribution, altDistribution);
    updateProbabilityTable(differenceDistribution, "differenceTableOutput", showDelta = true);
    updateProbabilityGraph(differenceDistribution, "differenceGraphOutput", showDelta = true);
}

// update output after someone makes changes to the deltas
function updateDeltaOutput() {
    var deckSize = parseInt(document.getElementById("deckSize").value, 10);
    var handSize = parseInt(document.getElementById("handSize").value, 10);
    var numStarters = parseInt(document.getElementById("numStarters").value, 10);

    var deckDelta = parseInt(document.getElementById("deckDelta").value, 10);
    var handDelta = parseInt(document.getElementById("handDelta").value, 10);
    var startersDelta = parseInt(document.getElementById("startersDelta").value, 10);
    
    var basicDistribution = generateBasicDistribution(deckSize, handSize, numStarters);
    var altDistribution = generateBasicDistribution(deckSize + deckDelta, handSize + handDelta, numStarters + startersDelta);
    var differenceDistribution = compareDistribution(basicDistribution, altDistribution);
    
    updateProbabilityDelta(basicDistribution, altDistribution);
    updateProbabilityTable(differenceDistribution, "differenceTableOutput", showDelta = true);
    updateProbabilityGraph(differenceDistribution, "differenceGraphOutput", showDelta = true);
}

// reset the delta form inputs
function resetDelta() {
    var elementsToReset = ["deckDelta", "handDelta", "startersDelta"];
    for (each in elementsToReset) {
        document.getElementById(each).reset();    
    }
}

// updates the probabilityOutput element on form input change
function updateProbabilityOutput(distBasic, outputElementId = "probabilityOutput") {
    var liveProbability = calculateProbabilityFromDistribution(distBasic);
    var output = document.getElementById(outputElementId);
    output.innerHTML = (100 * liveProbability).toFixed(2).toString() + '%';
}

// update the delta to probability on form input change
function updateProbabilityDelta(distBasicOld, distBasicNew) {
    var oldProbability = calculateProbabilityFromDistribution(distBasicOld);
    var newProbability = calculateProbabilityFromDistribution(distBasicNew);
    var deltaProbability = newProbability - oldProbability;
    
    var outputNew = document.getElementById("probabilityOutputWithDelta");
    outputNew.innerHTML = (100 * newProbability).toFixed(2).toString() + '%';
    var outputDelta = document.getElementById("probabilityDeta");
    outputDelta.innerHTML = (100 * deltaProbability).toFixed(2).toString() + '%';
}

// updates the probabilityTable element on form input change
function updateProbabilityTable(distBasic, tableElementId = "probabilityTableOutput", showDelta = false) {
    if (showDelta) {
        var colName = "Changes to Probability of Exact Match";
    } else {
        var colName = "Probability of Exact Match";
    }

    var outputTable = document.getElementById(tableElementId);
    outputTable.innerHTML = `<tr><td bgcolor="lightgreen">Number of Matches</td><td bgcolor="lightgreen">${colName}</td>`

    for (const [key, value] of Object.entries(distBasic)) {
        var displayProbability = (100 * value).toFixed(2).toString() + '%';
        if (showDelta && value < 0) {
            var textColor = "red";
        } else {
            var textColor = "black";
        }
        var newTableRow = `<tr><td align="right" bgcolor="white">${key}</td><td align="right" bgcolor="white"><font color=${textColor}>${displayProbability}</font></td></tr>`;
        outputTable.innerHTML += newTableRow;
    }
}

// update the bar graph on form input change
function updateProbabilityGraph(distBasic, graphElementId = "barGraphOutput", showDelta = false) {
    let chartStatus = Chart.getChart(graphElementId); // <canvas> id
    if (chartStatus != undefined) {
      chartStatus.destroy();
    }

    let ctx = document.getElementById(graphElementId);
    var xValues = [];
    var yValues = [];
    for (const [key, value] of Object.entries(distBasic)) {
        xValues.push(key);
        yValues.push(value);
    }

    if (showDelta) {
        var inputLabel = "Changes to Probability of Exact Match";
        var bgColor = [];
        for (let i = 0; i < yValues.length; i++) {
            if (yValues[i] < 0) {
                bgColor.push("salmon");
            } else {
                bgColor.push("lime");
            }
        }
    } else {
        var inputLabel = "Probability of Drawing Exactly X Matches";
        var bgColor = "blue";
    }

    var myChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: xValues,
            datasets: [{
                label: inputLabel,
                //backgroundColor: barColors,
                backgroundColor: bgColor,
                data: yValues
            }]
        },
        options: {
            scales: {
                y: {
                    ticks: {
                        callback: function(value, index, ticks) {
                            return (100 * value).toFixed(1) + '%';
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
