var chart = new Chart(ctx, {
  options: {
    plugins: {
      // Change options for ALL labels of THIS CHART
      datalabels: {
        color: '#36A2EB'
      }
    }
  },
  data: {
    datasets: [{
      // Change options only for labels of THIS DATASET
      datalabels: {
        color: '#FFCE56'
      }
    }]
  }
});

function graphScatter() {
    var deckSize = parseInt(document.getElementById("deckSize").value, 10);
    var handSize = parseInt(document.getElementById("handSize").value, 10);
    var numStarters = parseInt(document.getElementById("numStarters").value, 10); 

    var xValues = [];
    var xyValues = [];
    for (let i = 0; i < handSize + 1; i++) {
        xValues[i] = i;
        xyValues[i] = {x: i, y: exactProbability(deckSize, handSize, numStarters, i)};
    }

    const myScatterChart = new Chart("myScatterChart", {
        type: "scatter",
        data: {
            labels: xValues,
            datasets: [{
                label: "Probability of Drawing Exactly X",
                pointRadius: 4,
                pointBackgroundColor: "rgb(0,0,255)",
                data: xyValues
            }]
        },
        options: {
            legend: {display: false},
/*            title: {
                display: true,
                text: 'Probability of Drawing Exactly X'
            },
*/
            scales: {
                xAxes: [{ticks: {min: 0, max:handSize}}],
                yAxes: [{ticks: {min: 0, max:1.0}}],
            }
        }
    });
}

function graphBar() {
    var deckSize = parseInt(document.getElementById("deckSize").value, 10);
    var handSize = parseInt(document.getElementById("handSize").value, 10);
    var numStarters = parseInt(document.getElementById("numStarters").value, 10); 

    var xValues = [];
    var yValues = [];
//    var barColors = ["red", "green","blue","orange","brown"];
    for (let i = 0; i < handSize + 1; i++) {
        xValues[i] = i;
        yValues[i] = exactProbability(deckSize, handSize, numStarters, i);
    }

    const myBarChart = new Chart("myBarChart", {
        type: "bar",
        data: {
            labels: xValues,
            datasets: [{
                label: "Probability of Drawing Exactly X",
                //backgroundColor: barColors,
                backgroundColor: "blue",
                data: yValues
        }]
      },
      options: {
        legend: {display: false},
            title: {
                display: true,
                text: 'Probability of Drawing Exactly X'
        },
        scales: {
            xAxes: [{ticks: {min: 0, max:handSize}}],
            yAxes: [{ticks: {min: 0, max:1.0}}],
        }
      }
    });
}