import {Chart, PieController, ArcElement, Legend, Title, Tooltip} from 'chart.js';
import {main} from "@popperjs/core";

Chart.register(PieController, ArcElement, Legend, Title, Tooltip);

export class Main {
    constructor(canvasId, titleText, chartData) {
        this.canvasElement = document.getElementById(canvasId);
        this.titleText = titleText;
        this.chartData = chartData;
        this.chart = null;

        if (this.canvasElement) {
            this.initChart();
        }
    }

    initChart() {
        this.chart = new Chart(this.canvasElement, {
            type: 'pie',
            data: {
                labels: ['Red', 'Orange', 'Yellow', 'Blue', 'Green'],
                datasets: [{
                  //  label: 'Dataset 1',
                    data: this.chartData,
                    backgroundColor: ['#DC3545', '#FD7E14', '#FFC107', '#0D6EFD', '#20C997']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: this.titleText,
                        position: 'top',
                        align: 'center',
                        color: '#290661',
                        font: {
                            size: 28
                        }
                    },

                }
            }
        });
    }
}
