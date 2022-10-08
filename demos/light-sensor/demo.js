var demo = new Demo({
    ui: {
        startPlot: {
            title: "Start plotting",
            type: "button",
        },
        stopPlot: {
            title: "Stop plotting",
            type: "button",
        },
        clear: {
            title: "Clear chart",
            type: "button",
        },
        samplingFrequency: {
            title: "Samples per second",
            type: "userInputNumerical",
            value: 10,
        },
        chartRangeX: {
            title: "x-axis range",
            type: "userInputNumerical",
            value: 300,
        },
        chartRangeY: {
            title: "y-axis range",
            type: "userInputNumerical",
            value: 5000,
        },
    },

    intervalID: null,
    cnt: 0,
    currentIlluminance: null,

    init: function () {
        $("#demo").append(
            $(
                '<div class="illuminance-indicator"><h2><span class="actively-monitoring"><span class="actively-monitoring-indicator"></span> <span class="js-monitoring-text"></span></span>Current illuminance: <span id="currentIlluminance"></span></h2></div><div id="chart"></div>'
            )
        );

        if ("AmbientLightSensor" in window) {
            $(".js-monitoring-text").html("Actively monitoring");
            _this = this;
            const sensor = new AmbientLightSensor();
            sensor.onreading = () => {
                _this.currentIlluminance = sensor.illuminance;
                $("#currentIlluminance").html(
                    _this.currentIlluminance + "&nbsp;lux"
                );
            };
            sensor.onerror = (event) => {
                console.log(event.error.name, event.error.message);
            };
            sensor.start();
        } else {
            $(".js-monitoring-text").html("Monitoring disabled");
            $(".actively-monitoring-indicator").addClass(
                "actively-monitoring-indicator--disabled"
            );
            $("#currentIlluminance").html("Not available");
        }

        // Plotly https://redstapler.co/javascript-realtime-chart-plotly/

        Plotly.plot(
            "chart",
            [
                {
                    y: [],
                    type: "line",
                    marker: {
                        // color: 'rgb(128, 0, 128)',
                        size: 1,
                    },
                },
            ],
            {
                yaxis: {
                    range: [0, this.ui.chartRangeY.value],
                    title: {
                        text: "Illuminance (lux)",
                    },
                },
                xaxis: {
                    range: [0, this.ui.chartRangeX.value],
                    title: {
                        text: "Number of samples elapsed",
                    },
                },
            }
        );
    },

    plotNextSample: function () {
        Plotly.extendTraces("chart", { y: [[this.currentIlluminance]] }, [0]);

        if (this.cnt > this.ui.chartRangeX.value) {
            Plotly.relayout("chart", {
                xaxis: {
                    range: [this.cnt - this.ui.chartRangeX.value, this.cnt],
                    title: {
                        text: "Number of samples elapsed",
                    },
                },
            });
        } else {
            Plotly.relayout("chart", {
                xaxis: {
                    range: [0, this.ui.chartRangeX.value],
                    title: {
                        text: "Number of samples elapsed",
                    },
                },
            });
        }
    },

    update: function (e) {
        if (e == "startPlot") {
            _this = this;
            _this.plotNextSample();
            _this.intervalID = setInterval(function () {
                _this.cnt++;
                _this.plotNextSample();
            }, 1000 / _this.ui.samplingFrequency.value);
        }

        if (e == "stopPlot") {
            clearInterval(this.intervalID);
        }

        if (e == "clear") {
            clearInterval(this.intervalID);
            Plotly.deleteTraces("chart", 0);
            this.cnt = 0;
            Plotly.relayout("chart", {
                xaxis: {
                    range: [0, _this.ui.chartRangeX.value],
                    title: {
                        text: "Number of samples elapsed",
                    },
                },
            });
            Plotly.addTraces("chart", {
                y: [],
                type: "line",
                marker: {
                    // color: 'rgb(128, 0, 128)',
                    size: 1,
                },
            });
        }

        if (e == "chartRangeX") {
            Plotly.relayout("chart", {
                xaxis: {
                    range: [0, _this.ui.chartRangeX.value],
                    title: {
                        text: "Number of samples elapsed",
                    },
                },
            });
        }

        if (e == "chartRangeY") {
            Plotly.relayout("chart", {
                yaxis: {
                    range: [0, this.ui.chartRangeY.value],
                    title: {
                        text: "Illuminance (lux)",
                    },
                },
            });
        }

        if (e == "samplingFrequency") {
            clearInterval(this.intervalID);
            $("#startPlot-interface button").click();
        }
    },
});
