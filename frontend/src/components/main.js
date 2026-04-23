import {Chart, PieController, ArcElement, Legend, Title, Tooltip} from 'chart.js';
import {HttpUtils} from "../utils/http-utils.js";
// import { Datepicker, DateRangePicker } from 'vanillajs-datepicker';
// import ru from "vanillajs-datepicker/locales/ru";
import {PeriodUtils} from "../utils/period-utils.js";

Chart.register(PieController, ArcElement, Legend, Title, Tooltip);

export class Main {
    constructor(route) {
        this.route = route;
        new PeriodUtils(this.getOperations.bind(this));

        // Object.assign(Datepicker.locales, ru);
        // this.periodButtons = document.querySelectorAll('.period-filter');
        // this.initDatePicker(this);
        // this.initPeriodFilters();

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

    // initDatePicker() {
    //     const rangeElement = document.getElementById('datepicker-range');
    //     const fromLink = document.getElementById('dateFromLink');
    //     const toLink = document.getElementById('dateToLink');
    //
    //     // Инициализация
    //     new DateRangePicker(rangeElement, {
    //         format: 'yyyy-mm-dd',
    //         autohide: true,
    //         language: 'ru'
    //     });
    //
    //     fromLink.addEventListener('click', () => document.getElementById('dateFrom').focus());
    //     toLink.addEventListener('click', () => document.getElementById('dateTo').focus());
    //
    //     rangeElement.addEventListener('changeDate', (e) => {
    //         const input = e.target; //
    //         const fromInput = document.getElementById('dateFrom');
    //         const toInput = document.getElementById('dateTo');
    //         const fromLink = document.getElementById('dateFromLink');
    //         const toLink = document.getElementById('dateToLink');
    //
    //         const link = (input.id === 'dateFrom') ? fromLink : toLink;
    //         if (input.value) {
    //             const date = new Date(input.value);
    //             link.innerText = date.toLocaleDateString('ru-RU');
    //         }
    //         this.checkIntervalAndRefresh();
    //     });
    // }
    //
    // checkIntervalAndRefresh() {
    //
    //     const fromInput = document.getElementById('dateFrom');
    //     const toInput = document.getElementById('dateTo');
    //
    //     const intervalBtn = document.querySelector('.period-filter[data-period="interval"]');
    //
    //     const from = fromInput.value;
    //     const to = toInput.value;
    //     if (intervalBtn && intervalBtn.classList.contains('active') && from && to) {
    //         this.getOperations('interval', from, to).then();
    //     }
    // }
    //
    // initPeriodFilters() {
    //     this.periodButtons.forEach(button => {
    //         button.addEventListener('click', (e) => {
    //
    //             this.periodButtons.forEach(btn => btn.classList.remove('active'));
    //             button.classList.add('active');
    //             const period = button.getAttribute('data-period');
    //
    //             if (period === 'interval') {
    //                 this.checkIntervalAndRefresh();
    //             } else {
    //                 this.getOperations(period).then();
    //             }
    //         });
    //     });
    // }

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

        console.log(`Результат обработки для ${type}:`, result);
        return result;
    }

    renderChart(canvasId, title, chartData) {
        const canvas = document.getElementById(canvasId);
        if (!canvas || chartData.labels.length === 0) return;

        const existingChart = Chart.getChart(canvas);
        if (existingChart) {
            existingChart.destroy();
        }

        if (chartData.labels.length === 0) {
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
