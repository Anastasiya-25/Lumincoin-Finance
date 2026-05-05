import {Chart, PieController, ArcElement, Legend, Title, Tooltip} from 'chart.js';
import {HttpUtils} from "../utils/http-utils.js";
import {PeriodUtils} from "../utils/period-utils.js";

Chart.register(PieController, ArcElement, Legend, Title, Tooltip);

export class Main {
    constructor(route) {
        this.route = route;
        new PeriodUtils(this.getOperations.bind(this));

        this.getOperations('all').then();
    }

    async getOperations(period, dateFrom = null, dateTo = null) {
        let url = '/operations?period=' + period;

        if (period === 'interval' && dateFrom && dateTo) {
            url += `&dateFrom=${dateFrom}&dateTo=${dateTo}`;
        }

        const result = await HttpUtils.request(url);

        if (result.redirect) {
            return this.route.open(result.redirect);
        }

        if (result.error || !result.response) {
            return alert("Ошибка загрузки данных для выбранного периода");
        }

        const incomeData = this.process(result.response, 'income');
        const expenseData = this.process(result.response, 'expense');

        this.renderChart('chartIncome', 'Доходы', incomeData);
        this.renderChart('chartExpenses', 'Расходы', expenseData);
    }

    process(operations, type) {
        const filtered = operations.filter(op => op.type === type);
        const totals = {};
        filtered.forEach(op => {
            const categoryName = op.category;
            const amount = Number(op.amount);
            if (!isNaN(amount)) {
                totals[categoryName] = (totals[categoryName] || 0) + amount;
            }
        });
        const result = {
            labels: Object.keys(totals),
            data: Object.values(totals)
        };
        return result;
    }

    renderChart(canvasId, title, chartData) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const existingChart = Chart.getChart(canvas);

        if (existingChart) {
            existingChart.destroy();
        }

        if (!chartData || !chartData.data || chartData.data.length === 0) {
            return;
        }

        new Chart(canvas, {
            type: 'pie',
            data: {
                labels: chartData.labels,
                datasets: [{
                    data: chartData.data,
                    backgroundColor: ['#DC3545', '#FD7E14', '#FFC107', '#0D6EFD', '#20C997', '#6610f2']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: title,
                        color: '#290661',
                        font: { size: 28 }
                    }
                }
            }
        });
    }

}
