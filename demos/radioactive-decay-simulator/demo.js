var demo = new Demo({

  ui: {
    halfLife: {
      title: "Half-life, \\( t_{1/2} \\)",
      value: 20,
      range: [1, 100],
      resolution: 1
    },
    trendLine: {
      title: "Show trendline",
      value: true
    },
    stepsOnGraph: {
      title: "Number of time steps shown on graph",
      value: 100,
      range: [10, 1000],
      resolution: 1
    },
    advance: {
      title: "Advance one step",
      type: "button"
    },
    startSimulation: {
      title: "Automatically advance steps",
      value: false,
    },
    reset: {
      title: "Reset",
      type: "button"
    }
  },
  addElements: function () {
    var sourceCanvas = document.createElement("canvas");
    sourceCanvas.width = "200";
    sourceCanvas.height = "200";
    sourceCanvas.className = "source";
    sourceCanvas.id = "source";
    $("#demo").append(sourceCanvas);

    var numberOfUndecayedLabel = document.createElement("div");
    numberOfUndecayedLabel.id = "numberOfUndecayed";
    numberOfUndecayedLabel.innerHTML = "Number of undecayed atoms: <br>";
	$("#demo").append(numberOfUndecayedLabel);    
    var chartCanvasWrapper = document.createElement("div");
    chartCanvasWrapper.id = "myChartWrapper";
    var chartCanvas = document.createElement("canvas");
    // chartCanvas.width = "400";
    // chartCanvas.height = "100";
    chartCanvas.id = "myChart";
    $("#demo").append(chartCanvasWrapper);
    $("#myChartWrapper").append(chartCanvas);
  },
  init: function () {
    // alert("hellp");
    this.addElements();
    this.canvas = document.getElementById("source");
    this.ctx = this.canvas.getContext("2d");

    this.width = 40;
    this.height = 40;
    this.numberOfAtoms = this.width * this.height;
    this.originalNumberOfAtoms = this.numberOfAtoms;

    $("#numberOfUndecayed").html("Number of undecayed atoms: <br> " + this.numberOfAtoms);

    this.steps = 0;
    // var probabilityOfDecay = 0.5;
    this.halfLife = this.ui.halfLife.value;
    this.decayConstant = Math.log(2) / this.halfLife;

    // this.numberOfTimeSteps = 100; //halfLife * 10;
    this.numberOfTimeSteps = this.ui.stepsOnGraph.value;
    this.undecayedCount = this.numberOfAtoms;

    this.record = Array(this.width)
      .fill()
      .map(() => Array(this.height).fill(0));

    this.ctx2 = document.getElementById("myChart").getContext("2d");

    this.myChart;
    this.setupChart();
  },
  startSimulation: function () {
    var _this = this;
    setTimeout(function () {
      _this.update();
    }, 10);
  },
  update: function (e) {
    if (e == "reset") {
      this.reset();
    } else if (e == "halfLife") {
      this.reset();
      this.decayConstant = Math.log(2) / this.ui.halfLife.value;
    } else if (e == "trendLine") {
      this.setupTrendline();
      this.myChart.data.datasets[1].data = this.trendLine;
      this.myChart.update();
    } else if (e == "stepsOnGraph") {
      this.numberOfTimeSteps = this.ui.stepsOnGraph.value;
      this.setupTrendline();
      this.myChart.data.datasets[1].data = this.trendLine;
      this.myChart.options.scales.x = {
        max: this.numberOfTimeSteps
      }
      this.myChart.update();

    } else {
      this.updateTimeStep();
      if (this.ui.startSimulation.value == true && this.numberOfAtoms > 0){
        var _this = this;
        setTimeout(function(){
          _this.update()
        },100);
      }
    }
  },

  reset: function () {
    this.numberOfAtoms = 1600;
    this.record = Array(this.width)
      .fill()
      .map(() => Array(this.height).fill(0));
    this.ctx.fillStyle = "#020535";
    this.ctx.fillRect(0, 0, 200, 200);
    this.steps = 0;
    this.myChart.destroy();
    this.setupChart();
    $("#numberOfUndecayed").html("Number of undecayed atoms: <br> " + this.numberOfAtoms);
  },

  setupTrendline: function () {
    this.trendLine = [];
    if (this.ui.trendLine.value) {
      // trendline
      for (k = 0; k <= this.numberOfTimeSteps; k++) {
        // trendLine[k] = {x:k, y: numberOfAtoms * Math.exp(-probabilityOfDecay * k)}
        this.trendLine[k] = {
          x: k,
          y:
            this.originalNumberOfAtoms *
            Math.pow(2, -k / this.ui.halfLife.value)
        };
      }
    }
  },

  setupChart: function () {
    this.setupTrendline();
    this.myChart = new Chart(this.ctx2, {
      // type: "scatter",
      data: {
        labels: ["Red"],
        datasets: [
          {
            type: "scatter",
            // label: "Number of undecayed atoms",
            data: [{ x: this.steps, y: this.numberOfAtoms }],
            backgroundColor: ["rgba(255, 99, 132, 0.2)"],
            borderColor: ["rgba(255, 99, 132, 1)"],
            borderWidth: 1,
            radius: 3
            // pointStyle: "crossRot"
          },
          {
            type: "scatter",
            data: this.trendLine,
            backgroundColor: ["rgba(255, 99, 132, 0.2)"],
            borderColor: ["rgba(0, 0, 0, 0.2)"],
            borderWidth: 1,
            pointRadius: 0,

            showLine: true
          }
        ]
      },
      options: {
        plugins: {
          legend: {
            display: false
          }
        },
        animation: false,
        scales: {
          y: {
            min: 0,
            max: this.width * this.height,
            title: {
              display: true,
              text: "Number of undecayed atoms"
            }
          },
          x: {
            min: 0,
            max: this.numberOfTimeSteps,
            title: {
              display: true,
              text: "Time steps elapsed"
            }
          }
        }
      }
    });
  },

  updateTimeStep: function () {
    this.ctx.fillStyle = "#2BFEA8";
    this.steps++;
    for (j = 0; j < this.width; j++) {
      for (i = 0; i < this.height; i++) {
        // if (Math.random() > (1 - probabilityOfDecay) && record[i][j] != "decayed") {
        if (
          Math.random() < 1 - Math.exp(-this.decayConstant) &&
          this.record[i][j] != "decayed"
        ) {
          this.record[i][j] = "decayed";

          this.ctx.fillRect(i * 5, j * 5, 5, 5);
          this.numberOfAtoms--;
        }
      }
      $("#numberOfUndecayed").html("Number of undecayed atoms: <br> " + this.numberOfAtoms);
    }
    //   add this line to avoid rendering chart every time
    if (this.steps % 50 == 0 || true) {
      this.myChart.data.datasets[0].data.push({
        x: this.steps,
        y: this.numberOfAtoms
      });
      this.myChart.update();
    }
  }
});
