var express = require('express');
var app = express();

app.get('/', function (req, res) {

    createChart(res);

});


function createChart(res) {
    // Using the node canvas module
    var fs = require('fs');
    var Chart = require('chart.js');
    var jsdom = require('jsdom');
    jsdom.defaultDocumentFeatures = {
        FetchExternalResources: ["script"],
        ProcessExternalResources: true
    };
    jsdom.env('<html><body><div id="chart-div" style="font-size:12px; width:800px; height:800px;"><canvas id="myChart" width="400" height="400" style="width:400px;height:400px"></canvas>></div></body></html>',
        function (err, window) {
            global.window = window;
            global.document = window.document;
            var canvas = window.document.getElementById('myChart');
            var ctx = canvas.getContext('2d');

            var myChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
                    datasets: [{
                        label: '# of Votes',
                        data: [12, 19, 3, 5, 2, 3],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255,99,132,1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: false,
                    animation: false,
                    width: 400,
                    height: 400,
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                }
            });

            canvas.toBlob(function(blob) {

                res.setHeader('Content-disposition', 'attachment; filename=somechart.png');
                res.setHeader('Content-type', 'image/png');
                res.send(jsdom.blobToBuffer(blob));



            }, "image/png");

        }
    )


}



var server = app.listen(8080, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Example app listening at http://%s:%s", host, port)
});